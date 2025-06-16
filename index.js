// this creates a constant variable that storesAPI key for accessing the database(TMDB)
const apiKey = '0fb406d802222f0b4cab20429f89ec21';
const watchlist = [];


// search movie function it allow actions that involve waiting for data, like fetching from an API
async function searchMovies() {
    const query = document.getElementById('search').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (!query) {
        resultsDiv.innerHTML = '<p>Please enter a movie name.</p>';
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data.results && data.results.length > 0) {

          data.results.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';
        
            // Fallback for poster
            const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : 'https://via.placeholder.com/200x300?text=No+Image';
        
            const overviewId = `overview-${movie.id}`;
        
            movieDiv.innerHTML = `
                <img src="${posterUrl}" alt="${movie.title} Poster" style="cursor:pointer;" onclick="document.getElementById('${overviewId}').style.display = document.getElementById('${overviewId}').style.display === 'block' ? 'none' : 'block'">
                <h3>${movie.title} (${movie.release_date ? movie.release_date.slice(0,4) : 'Not available'})</h3>
                <p>Release Date: <b>${movie.release_date || 'Not available'}</b></p>
                <p>TMDB Rating: <b>${movie.vote_average ? movie.vote_average.toFixed(1) : 'Not Available'}</b>⭐</p>
                <div id="${overviewId}" style="display:none; margin:10px 0; padding:10px; background:#ffffff0f; border-radius:5px; color:#ddd;">
                    <b>Overview:</b> ${movie.overview ? `${movie.overview.slice(0,100)}...`: 'No overview available.'}
                </div>
                <div class="rating-group">
                    <label for="rating-${movie.id}">Your Rating: </label>
                    <input type="number" id="rating-${movie.id}" min="1" max="10" step="0.1" placeholder="7.5">
                </div>
                <button onclick="addToWatchlist(${movie.id}, '${escapeQuotes(movie.title)}', '${movie.poster_path ? movie.poster_path : ''}', '${movie.release_date || ''}')">Add to Watchlist</button>
            `;
            resultsDiv.appendChild(movieDiv);
        });

            data.results.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.className = 'movie';
                const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
                movieDiv.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title} Poster">
                    <h3>${movie.title}(${movie.release_date ? movie.release_date.slice(0, 4) : 'Not available'})</span></h3>
                     <p>Release Date: <b>${movie.release_date}</b></p>
                     <p>TMDB Rating: <b>${movie.vote_average ? movie.vote_average.toFixed(1) : 'Not Available'}</b>⭐</p>
                      <button onclick="addToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path ? movie.poster_path : ''}', '${movie.release_date}')">Add to Watchlist</button>
                 

                `;
                resultsDiv.appendChild(movieDiv);
            });

        } else {
            resultsDiv.innerHTML = '<p>No movies found.</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsDiv.innerHTML = '<p style="color:red;">Error fetching data. Please try again.</p>';
    }
}
// This defines a function to add a movie to the watchlist

function addToWatchlist(movieId, title, posterPath, release_date) {
    if (watchlist.find(movie => movie.id === movieId)) {
        alert('This movie is already in your watchlist.');
        return;
    }
    const ratingInput = document.getElementById(`rating-${movieId}`);
    let rating = ratingInput && ratingInput.value ? (ratingInput.value) : null;
    watchlist.push({
        id: movieId,
        title,
        posterPath,
        release_date,
        rating: rating && rating > 0 ? rating : 'Not available'
    });
    displayWatchlist();

}
// This  defines a function to remove a movie from the watchlist
function removeFromWatchlist(movieId) {
    const index = watchlist.findIndex(movie => movie.id === movieId);
    if (index > -1) {
        watchlist.splice(index, 1);
        displayWatchlist();
    }
}

// This defines a function to display the watchlist
function displayWatchlist() {
    const watchlistDiv = document.getElementById('watchlist');
    watchlistDiv.innerHTML = '';
    if (watchlist.length === 0) {
        watchlistDiv.innerHTML = '<p>Your watchlist is empty.</p>';
        return;
    }


    watchlist.forEach(movie => {
        const item = document.createElement('div');
        item.className = 'movie';
        const posterUrl = movie.posterPath ? `https://image.tmdb.org/t/p/w200${movie.posterPath}` : 'https://via.placeholder.com/200x300?text=No+Image';
        item.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title} Poster">
            <h3>${movie.title}</h3>
            <p>Release Date: <b>${movie.release_date || 'Not available'}</b></p>
           <p>TMDB Rating: <b>${movie.vote_average ? movie.vote_average.toFixed(1) : 'Not available'}</b>⭐</p>
            <button onclick="removeFromWatchlist(${movie.id})">Remove</button>
        `;
        watchlistDiv.appendChild(item);
    });
}
displayWatchlist();
document.getElementById('hamburger').onclick = function () {
    document.getElementById('navLinks').classList.toggle('active');
};
function showPage(page) {
    document.querySelectorAll('.app-page').forEach(div => div.style.display = 'none');
    const pageDiv = document.getElementById('page-' + page);
    if (pageDiv) pageDiv.style.display = 'block';
    document.getElementById('navLinks').classList.remove('active');
}
function filterGenre(genre) {
    searchMoviesByGenre(genre);
    showPage('home');
    document.getElementById('navLinks').classList.remove('active');
}
function searchMoviesByGenre(genreName) {
    const genreMap = {
        'Comedy': 35,
        'Romantic': 10749,
        'Horror': 27,
        'Action': 28,
        'Drama': 18,

    };
    // from the genereMap objects finding the key from it
    const genreId = genreMap[genreName];
    if (!genreId) return;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>Searching for ${genreName} movies</p>`;
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`)
        .then(res => res.json())
        .then(data => {
            resultsDiv.innerHTML = '';
            if (data.results && data.results.length > 0) {
                data.results.forEach(movie => {
                    const movieDiv = document.createElement('div');
                    movieDiv.className = 'movie';
                    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
                    movieDiv.innerHTML = `
    <img src="${posterUrl}" alt="${movie.title} Poster">
    <h3>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : 'Not available'})</h3>
    <p>Release Date: <b>${movie.release_date || 'Not available'}</b></p>
    <p>TMDB Rating: <b>${movie.vote_average ? movie.vote_average.toFixed(1) : 'Not available'}</b> ⭐</p>
    <div class="rating-group">
        <label for="rating-${movie.id}">Your Rating: </label>
        <input type="number" id="rating-${movie.id}" min="1" max="10" step="0.1" placeholder="">
    </div>
    <button onclick="addToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path ? movie.poster_path : ''}', '${movie.release_date}')">Add to Watchlist</button>`;
                    resultsDiv.appendChild(movieDiv);
                });
            } else {
                resultsDiv.innerHTML = `<p>No ${genreName} movies found.</p>`;
            }
        });

      } 


async function fetchUpcomingMovies() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Loading upcoming movies...</p>';
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        resultsDiv.innerHTML = '';
        if (data.results && data.results.length > 0) {
            data.results.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.className = 'movie';
                const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=No+Image';
                movieDiv.innerHTML = `
                    <img src="${posterUrl}" alt="${movie.title} Poster">
                    <h3>${movie.title} (${movie.release_date ? movie.release_date.slice(0, 4) : 'Not available'})</h3>
                    <p>Release Date: <b>${movie.release_date || 'Not available'}</b></p>
                    <p>TMDB Rating: <b>${movie.vote_average ? movie.vote_average.toFixed(1) : 'Not available'}</b>⭐</p>
                    <button onclick="addToWatchlist(${movie.id}, '${movie.title}', '${movie.poster_path ? movie.poster_path : ''}', '${movie.release_date}')">Add to Watchlist</button>
                `;
                resultsDiv.appendChild(movieDiv);
            });
        } else {
            resultsDiv.innerHTML = '<p>No upcoming movies found.</p>';
        }
    } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        resultsDiv.innerHTML = '<p style="color:red;">Error fetching upcoming movies. Please try again.</p>';
    }
}






