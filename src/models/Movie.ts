import mongoose, { Schema, Document } from "mongoose";

interface IMovie extends Document {
  title: string;
  description: string;
  genre: string;
  poster?: string;
  releaseYear: number;
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  poster: { type: String },
  releaseYear: { type: Number, required: true },
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
