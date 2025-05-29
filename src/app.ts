import express from "express";
import cors from "cors";
import env from "dotenv";

// Environment variables
env.config();

import connect from './config/database';
import logger from "@utils/pino";
import fileUpload from "express-fileupload";
import { ReE } from "@services/generalHelper.service";
import { SERVER_ERROR_CODE } from "./constants/serverCode";
import { Request, Response, NextFunction } from "express";
import { authenticate } from "./middleware/auth.middleware";
import routes from "./routes";
import morgan from "morgan";



// Express App
const app = express();

// Middlewares

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// API endpoints
app.use("/api/*/v1/*",authenticate.bind(authenticate));
app.use("/api/v1/*",authenticate.bind(authenticate));

// Routes
app.use("/api", routes);
// Error handlers
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  ReE(res, SERVER_ERROR_CODE, "Internal Server Error" + err.stack);
});

// database connection
// Connect to the database
(async () => {
  try {
    await connect()
    console.log("✅ Database connected successfully!");
    if (process.env.DB_SYNC_ON_START === "ENABLE") {
      console.log("✅ All models synchronized.");
      require("./data/students.data");
    }
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();

//  server
app.listen(Number(process.env.PORT) || 3000,'0.0.0.0', () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
});
