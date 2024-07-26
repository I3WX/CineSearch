const ApiKey = "27a7c0c"
const url = `http://www.omdbapi.com/?apikey=${ApiKey}&`
const SearchBtn = document.getElementById("SearchBtn")
const SearchBar = document.getElementById("SearchBar")
const movieGrid = document.getElementById("movie-grid")

SearchBtn.addEventListener('click',async ()=>{
    let movieTitle = SearchBar.value
    if(!movieTitle){
        alert("Add movie Title ")
    }
    else{
        data = await getMovie(movieTitle)
        addMovie2PAge(data)
    }
})

function addMovie2PAge(data){
    movieGrid.innerHTML = ""
    data.forEach(movie => {
        let title = movie.Title
        let year = movie.Year
        let poster = movie.Poster
        console.log(title,year,poster)
        let div = document.createElement("div")
        div.setAttribute('class','movie')
        let h3 = document.createElement("h3")
        let p = document.createElement("p")
        let img = document.createElement("img")
        h3.innerHTML = title
        p.innerHTML = year
        img.setAttribute('src',poster)
        div.appendChild(img,h3,p)
        div.appendChild(h3)
        div.appendChild(p)
        movieGrid.appendChild(div)
    });
}

async function getMovie(title){
    try{
        const responds = await fetch(`${url}s=${title}`) 
        if(!responds.ok){
            throw new Error('Movie not found');
        }
        else{
            data = await responds.json()
            return data.Search
        }
    }catch(err) {
        console.error(err);
            alert('Movie not found. Please try again.');
    }
}
