import express, { Application } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

// 初始化 Express
const app: Application = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

// MongoDB 連接設定
const MONGO_URI = 'mongodb://localhost:27017/movie-ticket-system';
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log('MongoDB 連線成功'))
  .catch((err) => console.error('MongoDB 連線失敗：', err));

// 定義電影 Schema 和 Model
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  poster: { type: String, required: false },
  releaseYear: { type: Number, required: true },
});

const Movie = mongoose.model('Movie', movieSchema);

// API 路由
// 搜尋電影
app.get('/api/movies/search', async (req, res) => {
  try {
    const { title } = req.query;
    const movies = await Movie.find({
      title: { $regex: title, $options: 'i' }
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: '搜尋電影失敗', error: err });
  }
});

// 獲取單一電影詳情
app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: '找不到該電影' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: '獲取電影詳情失敗', error: err });
  }
});

// 獲取所有電影
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: '查詢電影失敗', error: err });
  }
});

// 新增電影
app.post('/api/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json({ message: '新增電影成功', data: savedMovie });
  } catch (err) {
    res.status(500).json({ message: '新增電影失敗', error: err });
  }
});

// 更新電影
app.put('/api/movies/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 回傳更新後的文件
      runValidators: true, // 確保資料符合 Schema
    });
    if (!updatedMovie) return res.status(404).json({ message: '找不到該電影' });
    res.json({ message: '更新電影成功', data: updatedMovie });
  } catch (err) {
    res.status(500).json({ message: '更新電影失敗', error: err });
  }
});

// 刪除電影
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ message: '找不到該電影' });
    res.json({ message: '刪除電影成功', data: deletedMovie });
  } catch (err) {
    res.status(500).json({ message: '刪除電影失敗', error: err });
  }
});

// 處理前端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});