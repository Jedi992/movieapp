const list = document.querySelector(".movie__list-grid");
const paginationList = document.querySelector(".movie__pagination-list");
const form = document.querySelector(".header__search-form")
const search = document.querySelector(".header__search-input")
const popupModal  = document.querySelector(".popup")
const popupButton = document.querySelector(".popup-btn")
const addButtonPopup = document.querySelector(".movie__card-button")
const cartListText = document.querySelector(".popup__text-span")
const API_KEY = "" // Ваш API-ключ
const API_URL_MOVIE_PAGE = `https://kinopoiskapiunofficial.tech/api/v2.2/films?page=`
const API_URL_MOVIE_DETAILS = `https://kinopoiskapiunofficial.tech/api/v2.2/films/`
const API_URL_MOVIE_SEARCH = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`
let popupArr = []



async function movieListGet(currentPaginationPage, searchUrl) {
  !currentPaginationPage ? currentPaginationPage = 1 : currentPaginationPage 
  let moviePageApi = API_URL_MOVIE_PAGE + currentPaginationPage
  let movieSearch = searchUrl || moviePageApi 

  const result = await fetch(
    movieSearch ,
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
}


function renderMovieList(movie) {
  let movieList = `<section id='${movie.kinopoiskId || movie.filmId}' class="movie__list-card">
                  <div class="movie__card-image">
                    <img width="350" src="${movie.posterUrlPreview}" alt="#" />
                  </div>
                  <div class="movie__card-content">
                    <h3 class="movie__card-title">${movie.nameRu}</h3>
                  </div>
                  <div class="movie__card-footer">
                    <span class="movie__card-rating">Рэйтинг: ${movie.ratingKinopoisk || movie.rating}</span>
                    <button class="movie__card-button">Добавить в желаемое</button>
                  </div>
                </section>`;
  list.insertAdjacentHTML("beforeend", movieList);
}

async function renderModal(data) {
  const img = new Image()
  img.src = data.posterUrl
  await img.decode()
  modalEl.innerHTML = `
  <div class="modal__card">
  <img class="modal__movie-backdrop" src=${data.posterUrl} alt="modal">
  <h2>
  <span class="modal__movie-title">Название - ${data.nameRu
  }</span>
  
  </h2>
  <span class="modal__movie-release-year">Год - ${data.year}</span>
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


let popupListMovie = document.querySelector('.popup__list-movie')

function renderPopup(movie) {
  
  
  popupListMovie.innerHTML += `<li id="${movie.kinopoiskId}" class="popup__list-item">

                      <div class="popup__item-info">
                        <img class="popup__list-img"
                          src="${movie.posterUrlPreview}" alt="poster">
                        <div class="popup__item-wrapper">
                          <div class="popup__item-block">
                            <p class="popup__item-title">${movie.nameRu}
                            </p>
                            <span class="popup__item-rating">${movie.ratingKinopoisk}</span>
                          </div>
                          <div class="popup__item-genre">
                            <p>Жанр: ${movie.genres.map(elem => elem.genre)}</p>
                          </div>
                        </div>
                      </div>
                      <div class="block-btn">
                        <div class="block__btn-delte">
                          <button class="item-btn">Удалить</button>
                      </div>
                    </li>`
  
}

function renderPopupEach() {
  if(popupArr.length === 0) {
    cartListText.style.display = "block"
  } else {
    cartListText.style.display = "none"
  }
  popupListMovie.innerHTML = ''
  popupArr.forEach(elem =>  renderPopup(elem) )
}


function renderMovie(data) {
  let movieArr = null;
  movieArr = data.items || data.films;
  movieArr.forEach((movie) => {
    if (movie.nameRu || movie.rating ) {
      renderMovieList(movie);
    }
  });
  

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


async function currentPageClick(event) {
  if (event.target.closest(".movie__pagination-item") === null) {
    return;
  }
  
  let currentPaginationPage = Number(event.target.textContent)

  let currentLi = document.querySelector(".movie__pagination-item.active");
  currentLi.classList.remove("active");
  event.target.classList.add("active");
  
  await movieListGet(currentPaginationPage);
  scrollTo(0, 0);
  
  
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
function clearMovieList() {
  list.innerHTML = "";
}

movieListGet();

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



list.addEventListener("click", (event) => { 
  if(event.target.closest('.movie__card-button')){ 
    return
  }
  const movieCardId =  event.target.closest('.movie__list-card')
  const movieCardBtn =  event.target.closest('.movie__card-button')
  if(movieCardId) {
    
    const movieId = movieCardId.id
   openModal(movieId);
  }
}
)

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearchUrl = `${API_URL_MOVIE_SEARCH}${search.value}`
  if(search.value) {

    movieListGet(1, apiSearchUrl)

  }
  scrollTo(0, 0);

})


paginationList.addEventListener("click", currentPageClick);




popupButton.addEventListener("click", () => {
  
  popupModal.classList.add('active')
})

function closePopup() {
  popupModal.classList.remove("active")
}

window.addEventListener("keydown", (e) => {
  if(e.keyCode === 27) {
    closePopup()
  }
})
window.addEventListener("click", (e) => {
  if(e.target === event.target.closest(".popup__body")) {
    closePopup()
  }
})

let isAddingMovie = false
async function popupAdd(popupid) {
  if(isAddingMovie) {
    return
  }
  
    const result = await fetch(
      API_URL_MOVIE_DETAILS + popupid,
        {
          method: "GET",
          headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await result.json();
    if(!popupArr.find(elem => elem.kinopoiskId === popupid)) {
      popupArr.push(data)
      popupArr.forEach(elem => renderPopupEach(elem))
      isAddingMovie = false
    }
  } 
  
  

  popupListMovie.addEventListener('click',(e) => {
    if(!e.target.closest('.item-btn')) {
      return
  }
  let popupBtnCard = e.target.closest('.popup__list-item');
  Number(popupBtnCard.id)
  popupArr = popupArr.filter((elem) => elem.kinopoiskId !== Number(popupBtnCard.id))
  renderPopupEach()
})
  


 list.addEventListener('click', (e) => {

  if(e.target.closest('.movie__card-button')){ 
    let popupIdBtn = e.target.closest('.movie__list-card');
   popupAdd(Number(popupIdBtn.id));
   
}});
