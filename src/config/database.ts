import logger from "@utils/pino";
import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "";

async function connect() {
  mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    logger.error(`MongoDB connection error: ${err}`)
  });
}
export default connect;
