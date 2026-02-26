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
  const inputValue = e.currentTarget[0].value;
  getPicture(inputValue);

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
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
}

/* <div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>; */
