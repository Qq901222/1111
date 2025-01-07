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
// 獲取所有電影
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie_1.default.find().sort({ createdAt: -1 });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: '獲取電影列表失敗', error });
    }
}));
// 獲取單一電影
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = yield Movie_1.default.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: '找不到該電影' });
        }
        res.json(movie);
    }
    catch (error) {
        res.status(500).json({ message: '獲取電影資訊失敗', error });
    }
}));
// 新增電影
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = new Movie_1.default(req.body);
        const savedMovie = yield movie.save();
        res.status(201).json(savedMovie);
    }
    catch (error) {
        res.status(400).json({ message: '新增電影失敗', error });
    }
}));
// 更新電影
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = yield Movie_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) {
            return res.status(404).json({ message: '找不到該電影' });
        }
        res.json(movie);
    }
    catch (error) {
        res.status(400).json({ message: '更新電影失敗', error });
    }
}));
// 刪除電影
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = yield Movie_1.default.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: '找不到該電影' });
        }
        res.json({ message: '刪除成功', movie });
    }
    catch (error) {
        res.status(500).json({ message: '刪除電影失敗', error });
    }
}));
exports.default = router;
