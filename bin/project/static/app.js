// search logic
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const searchContainer = document.querySelector('.search-container')
searchBtn.addEventListener('click', () => {

  searchContainer.style.display = 'flex'
  searchInput.focus();
});

