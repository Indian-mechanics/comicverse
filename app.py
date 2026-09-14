from flask import Flask, request, send_from_directory, jsonify, send_file
import sqlite3
import os
import re

app = Flask(__name__)

DB_NAME = "comicverse.db"




def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn




def init_db():

    conn = get_db()

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

    # Check columns
    columns = conn.execute(
        "PRAGMA table_info(comics)"
    ).fetchall()

    column_names = [column["name"] for column in columns]

    if "folder" not in column_names:

        conn.execute("""
            ALTER TABLE comics
            ADD COLUMN folder TEXT
        """)

        print("Folder column added.")

    conn.commit()
    conn.close()



@app.route("/")
@app.route("/Index.html")
def home():

    return send_from_directory(
        ".",
        "Index.html"
    )




@app.route("/Comics.html")
def comics_page():

    return send_from_directory(
        ".",
        "Comics.html"
    )




@app.route("/reader.html")
def reader_page():

    return send_from_directory(
        ".",
        "reader.html"
    )




@app.route("/api/comics")
def get_comics():

    conn = get_db()

    comics = conn.execute("""
        SELECT *
        FROM comics
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify([
        dict(comic)
        for comic in comics
    ])



@app.route("/api/comics/<int:comic_id>")
def get_comic(comic_id):

    conn = get_db()

    comic = conn.execute("""
        SELECT *
        FROM comics
        WHERE id = ?
    """, (comic_id,)).fetchone()

    conn.close()

    if comic is None:

        return jsonify({
            "error": "Comic not found"
        }), 404

    return jsonify(dict(comic))




@app.route("/api/comics/<int:comic_id>/pages")
def get_comic_pages(comic_id):

    conn = get_db()

    comic = conn.execute("""
        SELECT *
        FROM comics
        WHERE id = ?
    """, (comic_id,)).fetchone()

    conn.close()

    if comic is None:

        return jsonify({
            "error": "Comic not found"
        }), 404


    folder = comic["folder"]

    if not folder:

        return jsonify({
            "error": "Comic folder is not set"
        }), 400


  
    folder = os.path.abspath(folder)


    if not os.path.isdir(folder):

        return jsonify({
            "error": "Comic folder does not exist",
            "folder": folder
        }), 404


    pages = []

    for filename in os.listdir(folder):

        extension = os.path.splitext(filename)[1].lower()

        if extension in [".jpg", ".jpeg", ".png", ".webp"]:

            pages.append(filename)


    # Sort naturally
    def natural_sort(filename):

        import re

        return [
            int(text) if text.isdigit() else text.lower()
            for text in re.split(
                r"(\d+)",
                filename
            )
        ]

    pages.sort(key=natural_sort)


    return jsonify({

        "comic": dict(comic),

        "pages": pages

    })




@app.route("/api/comics/<int:comic_id>/page/<path:filename>")
def serve_comic_page(comic_id, filename):

    conn = get_db()

    comic = conn.execute("""
        SELECT folder
        FROM comics
        WHERE id = ?
    """, (comic_id,)).fetchone()

    conn.close()

    if comic is None:

        return "Comic not found", 404


    folder = comic["folder"]

    if not folder:

        return "Comic folder not configured", 400


    folder = os.path.abspath(folder)


    if not os.path.isdir(folder):

        return "Comic folder does not exist", 404


    
    requested_file = os.path.abspath(
        os.path.join(folder, filename)
    )

    if not requested_file.startswith(
        os.path.abspath(folder)
        + os.sep
    ):

        return "Invalid file", 403


    if not os.path.isfile(requested_file):

        return "Page not found", 404


    return send_file(requested_file)




@app.route("/<path:filename>")
def files(filename):

    return send_from_directory(
        ".",
        filename
    )

@app.route("/contact", methods=["POST"])
def contact():

    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    message = request.form.get("message", "").strip()

    conn = get_db()

    conn.execute("""
        INSERT INTO messages (name, email, message)
        VALUES (?, ?, ?)
    """, (name, email, message))

    conn.commit()
    conn.close()

    return """
    <script>
        alert("Message sent successfully!");
        window.location.href = "/";
    </script>
    """


@app.route("/messages", methods=["GET"])
def view_messages():

    conn = get_db()

    messages = conn.execute("""
        SELECT *
        FROM messages
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Contact Messages</title>

        <style>
            body {
                font-family: Arial;
                background: #0f172a;
                color: white;
                padding: 30px;
            }

            h1 {
                text-align: center;
            }

            .message {
                max-width: 700px;
                margin: 20px auto;
                padding: 20px;
                background: #1e293b;
                border-radius: 10px;
            }

            .message p {
                margin: 10px 0;
            }
        </style>
    </head>

    <body>

        <h1>Contact Messages</h1>
    """

    for msg in messages:

        html += f"""
        <div class="message">

            <p>
                <strong>Name:</strong>
                {msg["name"]}
            </p>

            <p>
                <strong>Email:</strong>
                {msg["email"]}
            </p>

            <p>
                <strong>Message:</strong>
                {msg["message"]}
            </p>

        </div>
        """

    html += """
    </body>
    </html>
    """

    return html

@app.route("/api/search")
def search_comics():

    query = request.args.get("q", "").strip()

    conn = get_db()

    if query == "":
        conn.close()
        return jsonify([])

    search_term = f"%{query}%"

    comics = conn.execute("""
        SELECT *
        FROM comics
        WHERE title LIKE ?
           OR genre LIKE ?
           OR description LIKE ?
        ORDER BY id DESC
    """, (
        search_term,
        search_term,
        search_term
    )).fetchall()

    conn.close()

    return jsonify([
        dict(comic)
        for comic in comics
    ])



if __name__ == "__main__":

    init_db()

    app.run(
        debug=True
    )



