import sqlite3

conn = sqlite3.connect("comicverse.db")

conn.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL
    )
""")

conn.commit()
conn.close()

print("Messages table created successfully.")