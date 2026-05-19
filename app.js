// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/router.js"
import { notFoundHandler } from "./middlewares/notFoundHandler.js"
import { errorLogger } from "./middlewares/errorLogger.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { router } from "./routes/router.js";


const app = express();

app.use(express.json())
app.use(cors())

app.use(router)

app.use(notFoundHandler)
app.use(errorLogger)
app.use(errorHandler)

export default app


//app.use('/api', router);
// Endpoint /api/health en router

/*

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

*/
