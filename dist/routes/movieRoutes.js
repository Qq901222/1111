"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Movie_1 = __importDefault(require("../models/Movie"));
const router = express_1.default.Router();
// 新增電影
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, genre, poster, releaseYear } = req.body;
        if (isNaN(releaseYear)) {
            return res.status(400).json({ message: "上映年份必須是數字" });
        }
        const movie = new Movie_1.default({ title, description, genre, poster, releaseYear });
        const savedMovie = yield movie.save();
        res.status(201).json({ message: "電影新增成功", data: savedMovie });
    }
    catch (error) {
        res.status(500).json({ message: "新增電影失敗", error });
    }
}));
// 查詢所有電影
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie_1.default.find();
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: "查詢電影失敗", error });
    }
}));
exports.default = router;
