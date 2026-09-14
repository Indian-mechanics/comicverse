import sqlite3

DB_NAME = "comicverse.db"



conn = sqlite3.connect(DB_NAME)



conn.execute("""
    CREATE TABLE IF NOT EXISTS comics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        genre TEXT NOT NULL,
        description TEXT,
        image TEXT,
        release_year INTEGER,
        folder TEXT
    )
""")




columns = conn.execute("""
    PRAGMA table_info(comics)
""").fetchall()

column_names = [column[1] for column in columns]

if "folder" not in column_names:

    conn.execute("""
        ALTER TABLE comics
        ADD COLUMN folder TEXT
    """)

    print("Folder column added to database.")





print("       ADD NEW COMIC")


title = input("Enter comic title: ")

genre = input("Enter genre: ")

description = input("Enter description: ")

image = input("Enter cover image filename: ")

folder = input("Enter comic folder path: ")

year = input("Enter release year: ")




conn.execute("""
    INSERT INTO comics
    (title, genre, description, image, release_year, folder)
    VALUES (?, ?, ?, ?, ?, ?)
""", (
    title,
    genre,
    description,
    image,
    int(year),
    folder
))


conn.commit()
conn.close()


print("Comic added successfully!")
