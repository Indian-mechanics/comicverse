const params = new URLSearchParams(
    window.location.search
);

const comicId = params.get("id");

const comicPage =
    document.getElementById("comicPage");

const pageNumber =
    document.getElementById("pageNumber");

const comicTitle =
    document.getElementById("comicTitle");

const previousButton =
    document.getElementById("previous");

const nextButton =
    document.getElementById("next");


let pages = [];

let currentPage = 0;


async function loadComic() {

    if (!comicId) {

        comicTitle.textContent =
            "No comic selected";

        return;
    }


    try {

        const response = await fetch(
            `/api/comics/${comicId}/pages`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load comic"
            );

        }


        const data =
            await response.json();



        comicTitle.textContent =
            data.comic.title;




        pages = data.pages;


        if (pages.length === 0) {

            comicTitle.textContent =
                "No pages found";

            pageNumber.textContent =
                "No pages";

            return;
        }



        currentPage = 0;

        showPage();


    } catch (error) {

        console.error(error);

        comicTitle.textContent =
            "Error loading comic";

        pageNumber.textContent =
            error.message;

    }

}




function showPage() {

    if (pages.length === 0) {

        return;
    }


    const filename =
        pages[currentPage];


    comicPage.src =
        `/api/comics/${comicId}/page/${encodeURIComponent(filename)}`;


    pageNumber.textContent =
        `Page ${currentPage + 1} / ${pages.length}`;




    previousButton.disabled =
        currentPage === 0;




    nextButton.disabled =
        currentPage === pages.length - 1;

}




nextButton.addEventListener(
    "click",
    function () {

        if (
            currentPage <
            pages.length - 1
        ) {

            currentPage++;

            showPage();

        }

    }
);




previousButton.addEventListener(
    "click",
    function () {

        if (currentPage > 0) {

            currentPage--;

            showPage();

        }

    }
);


/* -----------------------------------------
   START
----------------------------------------- */

loadComic();