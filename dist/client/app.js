// 處理表單提交（新增/編輯）
document.getElementById('movieForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const isEdit = form.dataset.mode === 'edit';
  const movieId = form.dataset.movieId;
  
  const formData = {
    title: document.querySelector('input[name="title"]').value,
    description: document.querySelector('textarea[name="description"]').value,
    genre: document.querySelector('input[name="genre"]').value,
    poster: document.querySelector('input[name="poster"]').value,
    releaseYear: document.querySelector('input[name="releaseYear"]').value,
  };

  try {
    // 根據模式決定 URL 和方法
    const url = isEdit ? `/api/movies/${movieId}` : '/api/movies';
    const method = isEdit ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // 重置表單和狀態
      form.reset();
      if (isEdit) {
        form.dataset.mode = 'add';
        delete form.dataset.movieId;
      }
      loadMovies(); // 重新載入電影列表
    }
  } catch (error) {
    console.error(isEdit ? '更新電影失敗:' : '新增電影失敗:', error);
  }
});

// 載入電影列表
async function loadMovies() {
  try {
    const response = await fetch('/api/movies');
    const movies = await response.json();
    const movieList = document.getElementById('movieList');
    
    // 確保 movies 是陣列
    if (!Array.isArray(movies)) {
      console.error('收到的資料不是陣列:', movies);
      return;
    }
    
    // 避免 XSS 攻擊的簡單函數
    const escapeHtml = (str) => {
      if (str === null || str === undefined) return '';
      return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    movieList.innerHTML = movies.map(movie => {
      // 檢查必要的電影屬性是否存在
      if (!movie || !movie._id) {
        console.error('電影資料不完整:', movie);
        return '';
      }

      return `
        <div class="movie-item">
          <h3>${escapeHtml(movie.title)}</h3>
          <p>${escapeHtml(movie.description)}</p>
          <p>類型: ${escapeHtml(movie.genre)}</p>
          <p>年份: ${escapeHtml(movie.releaseYear)}</p>
          <button onclick="editMovie('${escapeHtml(movie._id)}')" class="edit-btn">編輯</button>
          <button onclick="deleteMovie('${escapeHtml(movie._id)}')" class="delete-btn">刪除</button>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('載入電影失敗:', error);
    movieList.innerHTML = '<p>載入電影失敗</p>';
  }
}

// 刪除電影
async function deleteMovie(id) {
  if (!confirm('確定要刪除這部電影嗎？')) return;

  try {
    const response = await fetch(`/api/movies/${id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      loadMovies(); // 重新載入電影列表
    }
  } catch (error) {
    console.error('刪除電影失敗:', error);
  }
}

// 處理搜尋
document.querySelector('.search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchTerm = document.querySelector('input[name="search"]').value;

  try {
    const response = await fetch(`/api/movies/search?title=${encodeURIComponent(searchTerm)}`);
    const movies = await response.json();
    
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = movies.map(movie => `
      <div class="movie-item">
        <h3>${movie.title}</h3>
        <p>${movie.description}</p>
        <p>類型: ${movie.genre}</p>
        <p>年份: ${movie.releaseYear}</p>
        <button onclick="editMovie('${movie._id}')" class="edit-btn">編輯</button>
        <button onclick="deleteMovie('${movie._id}')" class="delete-btn">刪除</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('搜尋失敗:', error);
  }
});

// 編輯電影
async function editMovie(id) {
  try {
    const response = await fetch(`/api/movies/${id}`);
    const movie = await response.json();
    
    // 填充表單
    document.querySelector('input[name="title"]').value = movie.title;
    document.querySelector('textarea[name="description"]').value = movie.description;
    document.querySelector('input[name="genre"]').value = movie.genre;
    document.querySelector('input[name="poster"]').value = movie.poster || '';
    document.querySelector('input[name="releaseYear"]').value = movie.releaseYear;
    
    // 修改表單提交行為
    const form = document.getElementById('movieForm');
    form.dataset.mode = 'edit';
    form.dataset.movieId = id;
  } catch (error) {
    console.error('載入電影詳情失敗:', error);
  }
}

// 頁面載入時執行
document.addEventListener('DOMContentLoaded', () => {
  loadMovies();
});