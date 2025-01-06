import express from 'express';
import Movie from '../models/Movie';

const router = express.Router();

// 獲取所有電影
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: '獲取電影列表失敗', error });
  }
});

// 獲取單一電影
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: '找不到該電影' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: '獲取電影資訊失敗', error });
  }
});

// 新增電影
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: '新增電影失敗', error });
  }
});

// 更新電影
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ message: '找不到該電影' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: '更新電影失敗', error });
  }
});

// 刪除電影
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: '找不到該電影' });
    }
    res.json({ message: '刪除成功', movie });
  } catch (error) {
    res.status(500).json({ message: '刪除電影失敗', error });
  }
});

export default router;