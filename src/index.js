import axios from 'axios';
import { Notify } from 'notiflix';

const API_KEY = '54530633-d87da1398ffb7ca41953b047e';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('#search-form');
const gallary = document.querySelector('.gallery');
// const loadMoreBtn = document.querySelector('.load-more');git
const target = document.querySelector('.js-guard');

let options = {
  root: null,
  rootMargin: '400px',
  threshold: 1,
};

let observer = new IntersectionObserver(loadMore, options);
let page = 1;
let inputValue;

Notify.init({
  width: '280px',
  position: 'right-top',
  distance: '10px',
  timeout: 2000,
  pauseOnHover: true,
  ID: 'NotiflixNotify',
});

searchForm.addEventListener('submit', handlerForm);

function handlerForm(e) {
  e.preventDefault();
  gallary.innerHTML = '';
  page = 1;
  // loadMoreBtn.classList.add('hidden');
  inputValue = searchForm[0].value;
  getPicture(inputValue, page)
    .then(resp => {
      if (resp.totalHits > 0) {
        Notify.success(`Hooray! We found ${resp.totalHits} images))`);
        gallary.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
        observer.observe(target);
      } else {
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      // const totalPictures = resp.totalHits;
      // if (totalPictures > page * 40) {
      //   loadMoreBtn.classList.remove('hidden');
      // } else {
      //   loadMoreBtn.classList.add('hidden');
      // }
    })
    .catch(err => {
      Notify.failure('Something went wrong. Try again later');
      console.error(err);
    });
}

async function getPicture(value, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <div class="photo-card">
          <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="${largeImageURL}" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${downloads}
            </p>
          </div>
        </div>`
    )
    .join('');
}

// loadMoreBtn.addEventListener('click', loadMore);

function loadMore(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page++;
      getPicture(inputValue, page).then(resp => {
        const totalPictures = resp.totalHits;
        gallary.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
        if (totalPictures <= page * 40) {
          observer.unobserve(target);
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      });
    }
  });
  // page++;
  // getPicture(inputValue, page).then(resp => {
  //   // if (totalPictures > page * 40) {
  //   //   loadMoreBtn.classList.remove('hidden');
  //   // } else {
  //   //   loadMoreBtn.classList.add('hidden');
  //   // }
  //   gallary.insertAdjacentHTML('beforeend', createMarkup(resp.hits));
  // });
}
