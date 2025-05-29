import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "";

async function connect() {
  mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
}
export default connect;
