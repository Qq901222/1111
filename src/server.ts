import express, { Application } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';

// 初始化 Express
const app: Application = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // 處理 JSON 請求
app.use(cors()); // 啟用 CORS
app.use(express.static(path.join(__dirname, 'client'))); // 提供靜態檔案

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
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: '查詢電影失敗', error: err });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json({ message: '新增電影成功', data: savedMovie });
  } catch (err) {
    res.status(500).json({ message: '新增電影失敗', error: err });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ message: '找不到該電影' });
    res.json({ message: '刪除電影成功', data: deletedMovie });
  } catch (err) {
    res.status(500).json({ message: '刪除電影失敗', error: err });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});