import sqlite3

conn = sqlite3.connect("comicverse.db")

conn.execute("DELETE FROM comics")

conn.commit()
conn.close()

print("All comics deleted.")