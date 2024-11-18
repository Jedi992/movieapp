const list = document.querySelector(".movie__list-grid");
const paginationList = document.querySelector(".movie__pagination-list");
const form = document.querySelector(".header__search-form")
const search = document.querySelector(".header__search-input")
const API_KEY = "e5e5b828-9eeb-46de-957b-6540197a5d52"
const API_URL_MOVIE_PAGE = `https://kinopoiskapiunofficial.tech/api/v2.2/films?page=`
const API_URL_MOVIE_DETAILS = `https://kinopoiskapiunofficial.tech/api/v2.2/films/`
const API_URL_MOVIE_SEARCH = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`
let currentPage = 1;

async function movieListGet(currentPaginationPage) {
  !currentPaginationPage ? currentPaginationPage = 1 : currentPaginationPage 
  console.log(currentPaginationPage)
  const result = await fetch(
    currentAPI,
    {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await result.json();
  clearMovieList();
  renderMovie(data);
  renderPagination(data.totalPages,currentPaginationPage )
  console.log()

}



function renderMovieList(movie) {
  
  let movieList = `<section id='${movie.kinopoiskId}' class="movie__list-card">
                  <div class="movie__card-image">
                    <img width="350" src="${movie.posterUrlPreview}" alt="#" />
                  </div>
                  <div class="movie__card-content">
                    <h3 class="movie__card-title">${movie.nameRu}</h3>
                  </div>
                  <div class="movie__card-footer">
                    <span class="movie__card-rating">Рэйтинг: ${movie.ratingKinopoisk}</span>
                    <button class="movie__card-button">Подробнее</button>
                  </div>
                </section>`;
  list.insertAdjacentHTML("beforeend", movieList);

}
async function renderModal(data) {

  modalEl.innerHTML = `
  <div class="modal__card">
  <img class="modal__movie-backdrop" src=${data.posterUrl} alt="modal">
  <h2>
  <span class="modal__movie-title">Название - ${data.nameRu
  }</span>
  <span class="modal__movie-release-year">Год - ${data.year}</span>
  </h2>
  <ul class="modal__movie-info">
  <div class="loader"></div>
  <li class="modal__movie-genre">Жанр - ${data.genres.map((el)=> `<span>${el.genre}</span>`)}</li>
  <li>Сайт: <a class="modal__movie-site" href="${data.webUrl}">${data.webUrl}</a></li>
  <li class="modal__movie-genre">Описание - ${data.description
  ||  'отсутствует'} </li>
  </ul>
  <button type="button" class="modal__button-close">Закрыть</button>
  </div>
  `
  
}
function renderPagination (totalPages,currentPaginationPage){

  paginationList.innerHTML = ''
  for(let pages = 1;  pages <= totalPages; pages++) {
    let li = document.createElement("li")
    li.className = "movie__pagination-item";
    if(pages === currentPaginationPage) {
      li.classList.add('active')
    }
    li.textContent = pages;
    paginationList.appendChild(li)
  }
  
  
}
function clearMovieList() {
  list.innerHTML = "";
}

async function currentPageClick(event) {
  if (event.target.closest(".movie__pagination-item") === null) {
    return;
  }
  
  let currentPaginationPage = Number(event.target.textContent)
  console.log(currentPaginationPage)


  let currentLi = document.querySelector(".movie__pagination-item.active");
  currentLi.classList.remove("active");
  event.target.classList.add("active");
  
  await movieListGet(currentPaginationPage);
  scrollTo(0, 0);
  
  
}
 function renderMovie(data) {
  let movieArr = null;
  movieArr = data.items;
  movieArr.forEach((movie) => {
    if (movie.nameRu) {
      renderMovieList(movie);

    }
  });
  list.addEventListener("click", (event) => { 
    const movieCardId =  event.target.closest('.movie__list-card')
    const movieCardBtn =  event.target.closest('.movie__card-button')
    if(movieCardBtn) {
      const movieId = movieCardId.id
     openModal(movieId);
    }
  }
)

}

const modalEl = document.querySelector(".modal")

async function openModal(id) {
  
  const result = await fetch(
  API_URL_MOVIE_DETAILS + id,
    {
      method: "GET",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await result.json();
  await renderModal(data)
  
modalEl.classList.add("modal--show")
const btnClose = document.querySelector(".modal__button-close")
btnClose.addEventListener("click" ,() => closeModal())
}


  
function closeModal() {
  modalEl.classList.remove("modal--show")
}

movieListGet();

paginationList.addEventListener("click", currentPageClick);


window.addEventListener("click", (e) => {
  if(e.target === modalEl) {
    closeModal()
  }
})

window.addEventListener("keydown", (e) => {
  if(e.keyCode === 27) {
    closeModal()
  }
})

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearchUrl = `${API_URL_MOVIE_SEARCH}${search.value}`
  if(search.value) {
    
  }
  
})
