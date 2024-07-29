const ApiKey = "67716a0c24a80c6a6c6232666259df93";
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NzcxNmEwYzI0YTgwYzZhNmM2MjMyNjY2MjU5ZGY5MyIsIm5iZiI6MTcyMjAwODI0NC4yMTIxNTIsInN1YiI6IjY2YTNjMDQ0OTQ0NjJhZDRhOGFlNjk4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FT4CjUZ0f2wwCJf2946Wk21rLTmTco7HkJvYSjlNGdk'
    }
};
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let movieId = urlParams.get('id');
const movieDetail = document.getElementById("movieDetail");
const movieList = document.getElementById("movieList")

document.addEventListener('DOMContentLoaded', () => {
    (async (id) => {
        try {
            const responseData = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
            const responseImg = await fetch(`https://api.themoviedb.org/3/movie/${id}/images`, options);
            const responseVideo = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options);
            if (!responseData.ok || !responseVideo.ok || !responseImg.ok) {
                throw new Error('Movie not found');
            } else {
                const movieData = await responseData.json();
                const movieImg = await responseImg.json();
                const movieVideo = await responseVideo.json();
                console.log(movieImg);
                console.log(movieVideo);
                addMovie(movieData , movieImg , movieVideo);
            }
        } catch (err) {
            console.error(err);
            alert('Movie not found. Please try again.');
        }
    })(movieId);
});

function addMovie(data , movieData , videoData) {
    // Get the trailer video
    const trailer = videoData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';

    // Get the first 5 images
    const images = movieData.backdrops.slice(0, 5).map(img => `https://image.tmdb.org/t/p/w500${img.file_path}`);

    movieDetail.innerHTML = `
        <h2 class="title">${data.title}</h2>
        <p class="tagline">${data.tagline}</p>
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title} Poster">
        <p class="overview">${data.overview}</p>
        ${trailerUrl ? `<div class="trailer"> <iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` : ''}
        <p class="release-date"><strong>Release Date:</strong> ${data.release_date}</p>
        <p class="runtime"><strong>Runtime:</strong> ${data.runtime} minutes</p>
        <p class="genres"><strong>Genres:</strong> ${data.genres.map(genre => genre.name).join(', ')}</p>
        <p class="budget"><strong>Budget:</strong> $${data.budget.toLocaleString()}</p>
        <p class="revenue"><strong>Revenue:</strong> $${data.revenue.toLocaleString()}</p>
        <p class="production-companies"><strong>Production Companies:</strong> ${data.production_companies.map(company => company.name).join(', ')}</p>
        <p class="homepage"><strong>Official Website:</strong> <a href="${data.homepage}" target="_blank">${data.homepage}</a></p>
        <p class="imdb"><strong>IMDB:</strong> <a href="https://www.imdb.com/title/${data.imdb_id}/" target="_blank">${data.imdb_id}</a></p>
        <p class="vote-average"><strong>Rating:</strong> ${data.vote_average} ⭐ (${data.vote_count} votes)</p>
        <div class="movie-images">
            ${images.map(img => `<img src="${img}" alt="${data.title} Image">`).join('')}
        </div>
    `;
}

async function recommendationsMovie(movieId){
    try{
        const responds = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`, options) 
        if(!responds.ok){
            throw new Error('Movie not found');
        }
        else{
            data = await responds.json()
            loadRecommendationsMovie(data.results)
        }
    }catch(err) {
        console.error(err);
            alert('Movie not found. Please try again.');
    }
}

document.addEventListener("DOMContentLoaded", recommendationsMovie(movieId) )

async function loadRecommendationsMovie(data){
    let movieData = data.slice(0,10)
    movieList.innerHTML=" "
    movieData.forEach(movie => {
        let title = movie.title
        let poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        let rating = `${movie.vote_average} ⭐`
        let mainDiv = document.createElement("div")
        mainDiv.setAttribute("class" , "movie-item")
        mainDiv.setAttribute('movieID', movie.id);
        let innerDiv = document.createElement("div")
        let h3 = document.createElement("h3")
        let p = document.createElement("p")
        let img = document.createElement("img")
        h3.innerHTML = title
        p.innerHTML = rating
        img.setAttribute('src',poster)
        innerDiv.appendChild(h3)
        innerDiv.appendChild(p)
        mainDiv.appendChild(img)
        mainDiv.appendChild(innerDiv)
        movieList.appendChild(mainDiv)
    });
}

movieList.addEventListener('click' , (e)=>{
    if (e.target.classList.contains('movie-item') || e.target.closest('.movie-item')) {
        const movieDiv = e.target.classList.contains('movie-item') ? e.target : e.target.closest(".movie-item")
        const movieID = movieDiv.getAttribute("movieID")
        window.location.href = `movie-detail.html?id=${movieID}`;
    }

})
