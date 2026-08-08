from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI(title="Event Ticketing & Seat Booking Platform")

def db():
    return sqlite3.connect("event_ticketing.db")

def setup():
    con = db()
    cur = con.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS events(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        venue TEXT,
        event_date TEXT,
        price REAL
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS venues(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        location TEXT,
        capacity INTEGER
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS seats(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venue_id INTEGER,
        seat_number TEXT,
        status TEXT DEFAULT 'available'
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS bookings(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event_id INTEGER,
        booking_date TEXT,
        total_amount REAL,
        status TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS booking_items(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER,
        seat_id INTEGER,
        seat_number TEXT
    )
    """)

    con.commit()
    con.close()

setup()

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str

class Event(BaseModel):
    name: str
    description: str
    venue: str
    event_date: str
    price: float

class Venue(BaseModel):
    name: str
    location: str
    capacity: int

class Seat(BaseModel):
    venue_id: int
    seat_number: str

class Booking(BaseModel):
    user_id: int
    event_id: int
    seat_ids: list[int]

@app.get("/")
def home():
    return {"message": "Event Ticketing & Seat Booking Platform"}

@app.post("/users")
def create_user(data: User):
    con = db()
    cur = con.cursor()

    try:
        cur.execute(
            "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
            (data.name, data.email, data.password, data.role)
        )
        con.commit()
        user_id = cur.lastrowid
    except sqlite3.IntegrityError:
        con.close()
        raise HTTPException(400, "Email already exists")

    con.close()
    return {"message": "User created", "user_id": user_id}

@app.post("/events")
def create_event(data: Event):
    con = db()
    cur = con.cursor()

    cur.execute(
        """INSERT INTO events
        (name,description,venue,event_date,price)
        VALUES(?,?,?,?,?)""",
        (data.name, data.description, data.venue,
         data.event_date, data.price)
    )

    con.commit()
    event_id = cur.lastrowid
    con.close()

    return {"message": "Event created", "event_id": event_id}

@app.get("/events")
def get_events():
    con = db()
    rows = con.execute(
        "SELECT id,name,description,venue,event_date,price FROM events"
    ).fetchall()
    con.close()

    return [
        {
            "id": r[0],
            "name": r[1],
            "description": r[2],
            "venue": r[3],
            "event_date": r[4],
            "price": r[5]
        }
        for r in rows
    ]

@app.post("/venues")
def create_venue(data: Venue):
    con = db()
    cur = con.cursor()

    cur.execute(
        "INSERT INTO venues(name,location,capacity) VALUES(?,?,?)",
        (data.name, data.location, data.capacity)
    )

    con.commit()
    venue_id = cur.lastrowid
    con.close()

    return {"message": "Venue created", "venue_id": venue_id}

@app.post("/seats")
def create_seat(data: Seat):
    con = db()
    cur = con.cursor()

    venue = cur.execute(
        "SELECT id FROM venues WHERE id=?",
        (data.venue_id,)
    ).fetchone()

    if not venue:
        con.close()
        raise HTTPException(404, "Venue not found")

    cur.execute(
        "INSERT INTO seats(venue_id,seat_number,status) VALUES(?,?,?)",
        (data.venue_id, data.seat_number, "available")
    )

    con.commit()
    seat_id = cur.lastrowid
    con.close()

    return {"message": "Seat created", "seat_id": seat_id}

@app.get("/venues/{venue_id}/seats")
def get_seats(venue_id: int):
    con = db()

    rows = con.execute(
        "SELECT id,seat_number,status FROM seats WHERE venue_id=?",
        (venue_id,)
    ).fetchall()

    con.close()

    return [
        {
            "id": r[0],
            "seat_number": r[1],
            "status": r[2]
        }
        for r in rows
    ]

@app.post("/bookings")
def create_booking(data: Booking):
    con = db()
    cur = con.cursor()

    event = cur.execute(
        "SELECT price FROM events WHERE id=?",
        (data.event_id,)
    ).fetchone()

    if not event:
        con.close()
        raise HTTPException(404, "Event not found")

    if not data.seat_ids:
        con.close()
        raise HTTPException(400, "Select seats")

    marks = ",".join("?" for _ in data.seat_ids)

    seats = cur.execute(
        f"SELECT id,seat_number,status FROM seats WHERE id IN ({marks})",
        data.seat_ids
    ).fetchall()

    if len(seats) != len(data.seat_ids):
        con.close()
        raise HTTPException(400, "Invalid seat")

    for seat in seats:
        if seat[2] != "available":
            con.close()
            raise HTTPException(409, "Seat already booked")

    total = event[0] * len(seats)

    cur.execute(
        """INSERT INTO bookings
        (user_id,event_id,booking_date,total_amount,status)
        VALUES(?,?,?,?,?)""",
        (data.user_id,data.event_id,"now",total,"confirmed")
    )

    booking_id = cur.lastrowid

    for seat in seats:
        cur.execute(
            "UPDATE seats SET status='booked' WHERE id=?",
            (seat[0],)
        )

        cur.execute(
            """INSERT INTO booking_items
            (booking_id,seat_id,seat_number)
            VALUES(?,?,?)""",
            (booking_id,seat[0],seat[1])
        )

    con.commit()
    con.close()

    return {
        "message": "Ticket booked successfully",
        "booking_id": booking_id,
        "total_amount": total
    }

@app.get("/bookings/{user_id}")
def get_bookings(user_id: int):
    con = db()

    rows = con.execute(
        """SELECT id,event_id,booking_date,total_amount,status
        FROM bookings WHERE user_id=?""",
        (user_id,)
    ).fetchall()

    con.close()

    return [
        {
            "booking_id": r[0],
            "event_id": r[1],
            "booking_date": r[2],
            "total_amount": r[3],
            "status": r[4]
        }
        for r in rows
    ]

@app.delete("/bookings/{booking_id}")
def cancel_booking(booking_id: int):
    con = db()
    cur = con.cursor()

    booking = cur.execute(
        "SELECT id FROM bookings WHERE id=?",
        (booking_id,)
    ).fetchone()

    if not booking:
        con.close()
        raise HTTPException(404, "Booking not found")

    seats = cur.execute(
        "SELECT seat_id FROM booking_items WHERE booking_id=?",
        (booking_id,)
    ).fetchall()

    for seat in seats:
        cur.execute(
            "UPDATE seats SET status='available' WHERE id=?",
            (seat[0],)
        )

    cur.execute(
        "UPDATE bookings SET status='cancelled' WHERE id=?",
        (booking_id,)
    )

    con.commit()
    con.close()

    return {"message": "Booking cancelled successfully"}