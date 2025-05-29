import { Schema, model, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  description?: string;
  averageRating?: number;
  reviews: Types.ObjectId[]; // references to Review
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    averageRating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

export default model<IBook>("Book", BookSchema);
