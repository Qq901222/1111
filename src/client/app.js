document.addEventListener("DOMContentLoaded", () => {
    const movieForm = document.getElementById("movieForm");
    const moviesList = document.getElementById("moviesList");
  
    // 載入所有電影
    const loadMovies = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/movies");
        const movies = await response.json();
        moviesList.innerHTML = movies
          .map(
            (movie) => `
            <div class="movie-card">
              <h3>${movie.title}</h3>
              <p><strong>描述:</strong> ${movie.description}</p>
              <p><strong>類型:</strong> ${movie.genre}</p>
              <p><strong>放映時間:</strong> ${movie.showtimes.join(", ")}</p>
              <button class="btn delete-btn" data-id="${movie._id}">刪除</button>
            </div>
          `
          )
          .join("");
      } catch (error) {
        console.error("無法載入電影資料", error);
      }
    };
  
    // 新增電影
    movieForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const genre = document.getElementById("genre").value;
      const poster = document.getElementById("poster").value;
      const showtimes = document.getElementById("showtimes").value.split(",");
  
      try {
        await fetch("http://localhost:3000/api/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, genre, poster, showtimes }),
        });
        movieForm.reset();
        loadMovies();
      } catch (error) {
        console.error("新增電影失敗", error);
      }
    });
  
    // 刪除電影
    moviesList.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        try {
          await fetch(`http://localhost:3000/api/movies/${id}`, {
            method: "DELETE",
          });
          loadMovies();
        } catch (error) {
          console.error("刪除電影失敗", error);
        }
      }
    });
  
    // 初次載入電影
    loadMovies();
  });
  