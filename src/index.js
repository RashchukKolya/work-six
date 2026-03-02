import axios from 'axios';

const API_KEY = '54530633-d87da1398ffb7ca41953b047e';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('#search-form');
const gallary = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

searchForm.addEventListener('submit', handlerForm);

function handlerForm(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('hidden');
  gallary.innerHTML = '';
  const inputValue = searchForm[0].value;
  getPicture(inputValue).then(resp => {
    const totalPictures = resp.totalHits;
    if (totalPictures > page * 40) {
      page++;
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
    }
    const pictures = createMarkup(resp.hits);
    gallary.insertAdjacentHTML('beforeend', pictures);
  });
}

async function getPicture(value) {
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

loadMoreBtn.addEventListener('click', handlerForm);
