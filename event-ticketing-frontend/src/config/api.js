const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "") ||
  ""
).replace(/\/$/, "");

export default API_BASE_URL;
