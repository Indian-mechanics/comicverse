
console.log("ComicVerse loaded successfully!");



const exploreButton = document.querySelector(".explore-btn");

if (exploreButton) {

    exploreButton.addEventListener("click", function () {

        window.location.href = "/Comics.html";

    });

}





const slides = document.querySelector(".slides");

if (slides) {

    const images = document.querySelectorAll(".slides img");

    const nextButton = document.querySelector(".next");

    const prevButton = document.querySelector(".prev");

    const totalSlides = images.length;


    let currentSlide = parseInt(
        localStorage.getItem("comicVerseSlide")
    );


    if (isNaN(currentSlide)) {
        currentSlide = 0;
    }


    if (
        currentSlide < 0 ||
        currentSlide >= totalSlides
    ) {
        currentSlide = 0;
    }


    function showSlide() {

        slides.style.transform =
            "translateX(-" +
            (currentSlide * 100) +
            "%)";

        localStorage.setItem(
            "comicVerseSlide",
            currentSlide
        );

    }


    if (nextButton) {

        nextButton.addEventListener("click", function () {

            currentSlide++;

            if (currentSlide >= totalSlides) {
                currentSlide = 0;
            }

            showSlide();

        });

    }


    if (prevButton) {

        prevButton.addEventListener("click", function () {

            currentSlide--;

            if (currentSlide < 0) {
                currentSlide = totalSlides - 1;
            }

            showSlide();

        });

    }


    showSlide();


    setInterval(function () {

        currentSlide++;

        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        }

        showSlide();

    }, 3000);

}




function openComic(id) {

    window.location.href =
        `/reader.html?id=${id}`;

}




const comicContainer =
    document.getElementById("comicContainer");

if (comicContainer) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const search =
        params.get("search");


    let apiURL =
        "/api/comics";


    if (search) {

        apiURL =
            `/api/search?q=${encodeURIComponent(search)}`;

    }


    fetch(apiURL)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load comics"
                );

            }

            return response.json();

        })

        .then(comics => {

            comicContainer.innerHTML = "";


            if (comics.length === 0) {

                comicContainer.innerHTML = `
                    <p>
                        No comics found
                        ${
                            search
                                ? `for "${search}"`
                                : ""
                        }
                    </p>
                `;

                return;

            }


            comics.forEach(comic => {

                const card =
                    document.createElement("div");

                card.className =
                    "comic-card";


                card.innerHTML = `

                    <div class="comic-cover">

                        <img
                            src="/images/${comic.image}"
                            alt="${comic.title}"
                            onerror="
                                this.style.display='none'
                            "
                        >

                    </div>


                    <h3>
                        ${comic.title}
                    </h3>


                    <p>
                        ${comic.genre}
                    </p>


                    <p>
                        ${comic.description || ""}
                    </p>


                    <small>
                        ${comic.release_year || ""}
                    </small>


                    <br>
                    <br>


                    <button
                        class="read-btn"
                        onclick="openComic(${comic.id})"
                    >
                        Read Comic
                    </button>

                `;


                comicContainer.appendChild(card);

            });

        })

        .catch(error => {

            console.error(
                "Error loading comics:",
                error
            );

            comicContainer.innerHTML =
                "<p>Unable to load comics.</p>";

        });

}


// ==================================================
// FEATURED COMICS
// ==================================================

const featuredContainer =
    document.getElementById(
        "featuredContainer"
    );

if (featuredContainer) {

    fetch("/api/featured")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load featured comics"
                );

            }

            return response.json();

        })

        .then(comics => {

            featuredContainer.innerHTML = "";


            if (comics.length === 0) {

                featuredContainer.innerHTML =
                    "<p>No featured comics available.</p>";

                return;

            }


            comics.forEach(comic => {

                const card =
                    document.createElement("div");

                card.className =
                    "comic-card";


                card.innerHTML = `

                    <div class="comic-cover">

                        <img
                            src="/images/${comic.image}"
                            alt="${comic.title}"
                            onerror="
                                this.style.display='none'
                            "
                        >

                    </div>


                    <h3>
                        ${comic.title}
                    </h3>


                    <p>
                        ${comic.genre}
                    </p>


                    <p>
                        ${comic.description || ""}
                    </p>


                    <small>
                        ${comic.release_year || ""}
                    </small>


                    <br>
                    <br>


                    <button
                        class="read-btn"
                        onclick="openComic(${comic.id})"
                    >
                        Read Comic
                    </button>

                `;


                featuredContainer.appendChild(card);

            });

        })

        .catch(error => {

            console.error(
                "Featured comics error:",
                error
            );

            featuredContainer.innerHTML =
                "<p>Unable to load featured comics.</p>";

        });

}


// ==================================================
// LATEST COMICS
// ==================================================

const latestContainer =
    document.getElementById(
        "latestContainer"
    );

if (latestContainer) {

    fetch("/api/comics")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load latest comics"
                );

            }

            return response.json();

        })

        .then(comics => {

            latestContainer.innerHTML = "";


            const latest =
                comics.slice(0, 4);


            if (latest.length === 0) {

                latestContainer.innerHTML =
                    "<p>No comics available.</p>";

                return;

            }


            latest.forEach(comic => {

                const card =
                    document.createElement("div");

                card.className =
                    "comic-card";


                card.innerHTML = `

                    <div class="comic-cover">

                        <img
                            src="/images/${comic.image}"
                            alt="${comic.title}"
                            onerror="
                                this.style.display='none'
                            "
                        >

                    </div>


                    <h3>
                        ${comic.title}
                    </h3>


                    <p>
                        ${comic.genre}
                    </p>


                    <small>
                        ${comic.release_year || ""}
                    </small>


                    <br>
                    <br>


                    <button
                        class="read-btn"
                        onclick="openComic(${comic.id})"
                    >
                        Read Comic
                    </button>

                `;


                latestContainer.appendChild(card);

            });

        })

        .catch(error => {

            console.error(
                "Latest comics error:",
                error
            );

            latestContainer.innerHTML =
                "<p>Unable to load latest comics.</p>";

        });

}


// ==================================================
// SEARCH
// ==================================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchButton =
    document.getElementById(
        "searchButton"
    );


if (searchInput && searchButton) {

    function searchComics() {

        const query =
            searchInput.value.trim();


        if (query === "") {

            window.location.href =
                "/Comics.html";

            return;

        }


        window.location.href =
            `/Comics.html?search=${encodeURIComponent(query)}`;

    }


    searchButton.addEventListener(
        "click",
        searchComics
    );


    searchInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                searchComics();

            }

        }
    );

}

