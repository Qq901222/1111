import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: '',
  });

  // 獲取電影列表
  useEffect(() => {
    async function fetchMovies() {
      const response = await axios.get('/api/movies');
      setMovies(response.data);
    }
    fetchMovies();
  }, []);

  // 處理表單輸入
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 開始編輯
  const startEditing = (movie) => {
    setEditingMovie(movie._id); // 設定要編輯的電影 ID
    setFormData(movie); // 填入現有的電影資料
  };

  // 提交更新
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/movies/${editingMovie}`, formData);
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === editingMovie ? response.data : movie
        )
      );
      setEditingMovie(null); // 關閉編輯狀態
    } catch (error) {
      console.error('更新失敗:', error);
    }
  };

  return (
    <div>
      <h1>電影列表</h1>
      {movies.map((movie) => (
        <div key={movie._id}>
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          <button onClick={() => startEditing(movie)}>修改</button>
        </div>
      ))}

      {editingMovie && (
        <form onSubmit={handleUpdate}>
          <h2>修改電影</h2>
          <label>
            標題:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </label>
          <label>
            描述:
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </label>
          <label>
            類型:
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
            />
          </label>
          <label>
            發行年份:
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">保存</button>
          <button type="button" onClick={() => setEditingMovie(null)}>
            取消
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
