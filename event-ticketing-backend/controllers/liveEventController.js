const CACHE_TTL_MS = 60 * 1000;
const liveEventsCache = new Map();

const categoryQueries = {
    Music: { classificationName: "Music" },
    Sports: { classificationName: "Sports" },
    Theatre: { classificationName: "Arts & Theatre" },
    Festivals: { keyword: "festival" }
};

const getCategoryQuery = (category) => {
    if (!category) {
        return {};
    }

    const normalizedCategory = category.toLowerCase();
    const match = Object.entries(categoryQueries).find(([label]) =>
        label.toLowerCase() === normalizedCategory
    );

    return match ? match[1] : {};
};

const getFirstImage = (event) => {
    const preferredImage = event.images?.find((image) => image.ratio === "16_9" && image.url);
    return preferredImage?.url || event.images?.find((image) => image.url)?.url || "";
};

const getPriceLabel = (event) => {
    const priceRange = event.priceRanges?.[0];
    if (!priceRange) {
        return "Price unavailable";
    }

    const currency = priceRange.currency || "";
    const minimum = Number.isFinite(priceRange.min) ? priceRange.min : null;
    const maximum = Number.isFinite(priceRange.max) ? priceRange.max : null;

    if (minimum === null && maximum === null) {
        return "Price unavailable";
    }

    if (minimum !== null && maximum !== null && minimum !== maximum) {
        return `${currency} ${minimum}-${maximum}`.trim();
    }

    return `${currency} ${minimum ?? maximum}`.trim();
};

const normalizeEvent = (event) => {
    const venue = event._embedded?.venues?.[0];
    const localDate = event.dates?.start?.localDate;
    const localTime = event.dates?.start?.localTime;

    return {
        id: `ticketmaster:${event.id}`,
        slug: `ticketmaster-${event.id}`,
        title: event.name || "Untitled live event",
        category: event.classifications?.[0]?.segment?.name || "Live Event",
        date: localDate || "Date unavailable",
        time: localTime ? localTime.slice(0, 5) : "Time unavailable",
        venue: venue?.name || "Venue unavailable",
        city: venue?.city?.name || "Location unavailable",
        location: venue?.city?.name || venue?.name || "Location unavailable",
        image: getFirstImage(event),
        description: event.info || event.pleaseNote || "Live event from Ticketmaster.",
        price: getPriceLabel(event),
        availability: event.dates?.status?.code || event.dates?.status?.name || "Available",
        bookingUrl: event.url || "",
        isExternal: true
    };
};

const getLiveEvents = async (req, res) => {
    const {
        keyword,
        city,
        latitude,
        longitude,
        radius,
        category,
        startDateTime,
        endDateTime
    } = req.query;

    if (!process.env.TICKETMASTER_API_KEY) {
        return res.status(503).json({
            success: false,
            message: "Live event provider is not configured.",
            events: []
        });
    }

    const params = new URLSearchParams({
        apikey: process.env.TICKETMASTER_API_KEY,
        size: "50",
        sort: "date,asc"
    });

    if (city) params.set("city", city);
    if (keyword) params.set("keyword", keyword);
    if (latitude && longitude) params.set("latlong", `${latitude},${longitude}`);
    if (radius) params.set("radius", radius);
    if (startDateTime) params.set("startDateTime", startDateTime);
    if (endDateTime) params.set("endDateTime", endDateTime);

    const categoryQuery = getCategoryQuery(category);
    Object.entries(categoryQuery).forEach(([key, value]) => {
        if (key === "keyword" && keyword) {
            params.set(key, `${keyword} ${value}`);
        } else {
            params.set(key, value);
        }
    });

    const cacheKey = params.toString().replace(process.env.TICKETMASTER_API_KEY, "[key]");
    const cached = liveEventsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        return res.json({ success: true, source: "ticketmaster", events: cached.events });
    }

    try {
        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`);
        const payload = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: payload.fault?.faultstring || "Live event provider request failed.",
                events: []
            });
        }

        const normalizedEvents = (payload._embedded?.events || []).map(normalizeEvent);
        liveEventsCache.set(cacheKey, {
            expiresAt: Date.now() + CACHE_TTL_MS,
            events: normalizedEvents
        });

        return res.json({ success: true, source: "ticketmaster", events: normalizedEvents });
    } catch (error) {
        return res.status(502).json({
            success: false,
            message: "Live event provider is temporarily unavailable.",
            events: []
        });
    }
};

module.exports = { getLiveEvents };
