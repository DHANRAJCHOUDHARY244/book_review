import express from "express";
import cors from "cors";
import env from "dotenv";

// Environment variables
env.config()
import logger from "@utils/pino";
import fileUpload from "express-fileupload";
import { ReE, ReS } from "@services/generalHelper.service";
import { SERVER_ERROR_CODE } from "./constants/serverCode";
import { Request, Response, NextFunction } from "express";

import morgan from "morgan";
import connect from "@config/database";
import { authenticate } from "./middleware/auth.middleware";
import routes from "./routes";







// Express App
const app = express();

// Middlewares
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Health Check Endpoint
app.get("/", (req: Request, res: Response) => {
  ReS(res, 200, "OK", "Server is running smoothly!");
});


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
    if (process.env.INSERT_DUMMY_DATA) {
      await require("@data/dataInserter");
    }
  } catch (error) {
    logger.error(`Database connection error: ${error}`);
  }
})();

//  server
app.listen(Number(process.env.PORT) || 3000, () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
});
