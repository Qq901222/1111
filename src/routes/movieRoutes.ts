import express, { Request, Response } from "express";
import Movie from "../models/Movie";

const router = express.Router();

// 新增電影
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, genre, poster, releaseYear } = req.body;

    if (isNaN(releaseYear)) {
      return res.status(400).json({ message: "上映年份必須是數字" });
    }

    const movie = new Movie({ title, description, genre, poster, releaseYear });
    const savedMovie = await movie.save();
    res.status(201).json({ message: "電影新增成功", data: savedMovie });
  } catch (error) {
    res.status(500).json({ message: "新增電影失敗", error });
  }
});

// 查詢所有電影
router.get("/", async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "查詢電影失敗", error });
  }
});

export default router;
