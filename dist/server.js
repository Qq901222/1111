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
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// 初始化 Express
const app = (0, express_1.default)();
const PORT = 3001;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'client')));
// MongoDB 連接設定
const MONGO_URI = 'mongodb://localhost:27017/movie-ticket-system';
mongoose_1.default
    .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB 連線成功'))
    .catch((err) => console.error('MongoDB 連線失敗：', err));
// 定義電影 Schema 和 Model
const movieSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    poster: { type: String, required: false },
    releaseYear: { type: Number, required: true },
});
const Movie = mongoose_1.default.model('Movie', movieSchema);
// API 路由
// 搜尋電影
app.get('/api/movies/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.query;
        const movies = yield Movie.find({
            title: { $regex: title, $options: 'i' }
        });
        res.json(movies);
    }
    catch (err) {
        res.status(500).json({ message: '搜尋電影失敗', error: err });
    }
}));
// 獲取單一電影詳情
app.get('/api/movies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = yield Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: '找不到該電影' });
        }
        res.json(movie);
    }
    catch (err) {
        res.status(500).json({ message: '獲取電影詳情失敗', error: err });
    }
}));
// 獲取所有電影
app.get('/api/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie.find();
        res.json(movies);
    }
    catch (err) {
        res.status(500).json({ message: '查詢電影失敗', error: err });
    }
}));
// 新增電影
app.post('/api/movies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movie = new Movie(req.body);
        const savedMovie = yield movie.save();
        res.status(201).json({ message: '新增電影成功', data: savedMovie });
    }
    catch (err) {
        res.status(500).json({ message: '新增電影失敗', error: err });
    }
}));
// 更新電影
app.put('/api/movies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedMovie = yield Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // 回傳更新後的文件
            runValidators: true, // 確保資料符合 Schema
        });
        if (!updatedMovie)
            return res.status(404).json({ message: '找不到該電影' });
        res.json({ message: '更新電影成功', data: updatedMovie });
    }
    catch (err) {
        res.status(500).json({ message: '更新電影失敗', error: err });
    }
}));
// 刪除電影
app.delete('/api/movies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedMovie = yield Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie)
            return res.status(404).json({ message: '找不到該電影' });
        res.json({ message: '刪除電影成功', data: deletedMovie });
    }
    catch (err) {
        res.status(500).json({ message: '刪除電影失敗', error: err });
    }
}));
// 處理前端路由
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'client', 'index.html'));
});
// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
