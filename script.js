const ApiKey = "67716a0c24a80c6a6c6232666259df93";
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NzcxNmEwYzI0YTgwYzZhNmM2MjMyNjY2MjU5ZGY5MyIsIm5iZiI6MTcyMjAwODI0NC4yMTIxNTIsInN1YiI6IjY2YTNjMDQ0OTQ0NjJhZDRhOGFlNjk4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FT4CjUZ0f2wwCJf2946Wk21rLTmTco7HkJvYSjlNGdk'
    }
};
const SearchBtn = document.getElementById("SearchBtn");
const SearchBar = document.getElementById("SearchBar");
const movieGrid = document.getElementById("movie-grid");
const genreSelect = document.getElementById("genreSelect");
const Movieselect = document.getElementById("Movieselect");
const TVselect = document.getElementById("TVselect");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const WatchListBtn = document.getElementById("WatchList");

// Load watchlist from localStorage or initialize it if it doesn't exist
let Watchlist = JSON.parse(localStorage.getItem("MovieWatchList")) || [];

let currentPage = 1;
let totalPages = 1;
let currentUrl = "";

SearchBtn.addEventListener('click', async () => {
    let movieTitle = SearchBar.value;
    if (!movieTitle) {
        alert("Add movie Title");
    } else {
        const url = `https://api.themoviedb.org/3/search/movie?query=${movieTitle}&include_adult=false&language=en-US&page=1`
        const data = await fetchData(url);
        addMovie2Page(data.results);
        currentPage = 1;
        pageInfo.innerHTML = `Page ${currentPage}`;
    }
});

genreSelect.addEventListener('change', async () => {
    const selectedGenre = genreSelect.value;
    if (selectedGenre) {
        let url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genresID[selectedGenre]}&language=en`;
        let data = await fetchData(url);
        addMovie2Page(data.results);
        currentPage = 1;
        pageInfo.innerHTML = `Page ${currentPage}`;
    }
});

Movieselect.addEventListener('change', async () => {
    const display = Movieselect.value;
    if (display == "Now_Playing" || display == "Popular" || display == "top_Rated" || display == "Upcoming") {
        let url = `https://api.themoviedb.org/3/movie/${display.toLowerCase()}?language=en-US&page=1`;
        let data = await fetchData(url);
        addMovie2Page(data.results);
        currentPage = 1;
        pageInfo.innerHTML = `Page ${currentPage}`;
    }
});

TVselect.addEventListener('change', async () => {
    const display = TVselect.value;
    if (display == "airing_today" || display == "on_the_air" || display == "popular" || display == "top_rated") {
        let url = `https://api.themoviedb.org/3/tv/${display.toLowerCase()}?language=en-US&page=1`;
        let data = await fetchData(url);
        console.log(data.results);
        addMovie2Page(data.results);
        currentPage = 1;
        pageInfo.innerHTML = `Page ${currentPage}`;
    }
});

function addMovie2Page(data) {
    movieGrid.innerHTML = "";
    data.forEach(movie => {
        let title = movie.title ? movie.title : movie.name;
        let rating = `${movie.vote_average} ⭐`;
        let poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        let div = document.createElement("div");
        div.setAttribute('class', 'movie');
        div.setAttribute('movieID', movie.id);

        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        let img = document.createElement("img");
        let heartImg = document.createElement("img");
        
        h3.innerHTML = title;
        p.innerHTML = rating;
        img.setAttribute('src', poster);
        heartImg.setAttribute('class', 'heart');
        
        // Check if movie is in the watchlist and update heart image accordingly
        if (Watchlist.includes(movie.id)) {
            heartImg.setAttribute('src', 'image/redHeart.svg');
        } else {
            heartImg.setAttribute('src', 'image/blackHeart.svg');
        }
        
        heartImg.addEventListener('click', (e) => {
            e.stopPropagation();
            if (Watchlist.includes(movie.id)) {
                Watchlist = Watchlist.filter(id => id !== movie.id);
                heartImg.setAttribute('src', 'image/blackHeart.svg');
            } else {
                Watchlist.push(movie.id);
                heartImg.setAttribute('src', 'image/redHeart.svg');
            }
            localStorage.setItem("MovieWatchList", JSON.stringify(Watchlist));
        });

        div.appendChild(img);
        div.appendChild(heartImg);
        div.appendChild(h3);
        div.appendChild(p);
        movieGrid.appendChild(div);
    });
}

async function fetchData(url) {
    try {
        console.log("hi from fetch");
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Movie not found');
        } else {
            const data = await response.json();
            currentUrl = url;
            totalPages = data.total_pages;
            return data;
        }
    } catch (err) {
        console.error(err);
        alert('Movie not found. Please try again.');
    }
}

(async function loadMovie() {
    try {
        const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
        let data = await fetchData(url);
        addMovie2Page(data.results);
    } catch (err) {
        console.error(err);
        alert('Some error in page. Please try again.');
    }
})();

const genresID = {
    "Action": 28,
    "Adventure": 12,
    "Animation": 16,
    "Comedy": 35,
    "Crime": 80,
    "Documentary": 99,
    "Drama": 18,
    "Family": 10751,
    "Fantasy": 14,
    "History": 36,
    "Horror": 27,
    "Music": 10402,
    "Mystery": 9648,
    "Romance": 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    "Thriller": 53,
    "War": 10752,
    "Western": 37
};

movieGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('movie') || e.target.closest('.movie')) {
        const movieDiv = e.target.classList.contains('movie') ? e.target : e.target.closest('.movie');
        const movieID = movieDiv.getAttribute('movieID'); 
        window.location.href = `/moviePage/movie-detail.html?id=${movieID}`;
    }
});

prevBtn.addEventListener('click', async () => {
    if (currentPage > 1) {
        currentPage--;
        const movies = await fetchData(`${currentUrl}&page=${currentPage}`);
        addMovie2Page(movies.results);
        pageInfo.innerHTML = `Page ${currentPage}`;
    }
});

nextBtn.addEventListener('click', async () => {
    if (currentPage <= totalPages) {
        currentPage++;
        const movies = await fetchData(`${currentUrl}&page=${currentPage}`);
        addMovie2Page(movies.results);
        pageInfo.innerHTML = `Page ${currentPage}`;
    }
});

WatchListBtn.addEventListener("click", async (e) => {
    e.preventDefault();  // Prevent default behavior
    movieGrid.innerHTML = "";
    for (const movieID of Watchlist) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options);
            if (!response.ok) {
                throw new Error('Movie not found');
            } else {
                const movieData = await response.json();
                let title = movieData.title ? movieData.title : movieData.name;
                let rating = `${movieData.vote_average} ⭐`;
                let poster = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
                let div = document.createElement("div");
                div.setAttribute('class', 'movie');
                div.setAttribute('movieID', movieData.id);

                let h3 = document.createElement("h3");
                let p = document.createElement("p");
                let img = document.createElement("img");
                let heartImg = document.createElement("img");
                
                h3.innerHTML = title;
                p.innerHTML = rating;
                img.setAttribute('src', poster);
                heartImg.setAttribute('class', 'heart');
                
                // Check if movie is in the watchlist and update heart image accordingly
                if (Watchlist.includes(movieData.id)) {
                    heartImg.setAttribute('src', 'image/redHeart.svg');
                } else {
                    heartImg.setAttribute('src', 'image/blackHeart.svg');
                }
                
                heartImg.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (Watchlist.includes(movieData.id)) {
                        Watchlist = Watchlist.filter(id => id !== movieData.id);
                        heartImg.setAttribute('src', 'image/blackHeart.svg');
                    } else {
                        Watchlist.push(movieData.id);
                        heartImg.setAttribute('src', 'image/redHeart.svg');
                    }
                    localStorage.setItem("MovieWatchList", JSON.stringify(Watchlist));
                });

                div.appendChild(img);
                div.appendChild(heartImg);
                div.appendChild(h3);
                div.appendChild(p);
                movieGrid.appendChild(div);
            }
        } catch (err) {
            console.error(err);
            alert('Some error occurred while loading watchlist. Please try again.');
        }
    }
});
