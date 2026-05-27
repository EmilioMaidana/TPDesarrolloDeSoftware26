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

const server = new Server(app)

const turnoRepository = new TurnoRepository()

const turnoService =
    new TurnoService(turnoRepository)

const turnoController =
    new TurnoController(alojamientoService)

server.setController(
    TurnoController,
    turnoController
)


routes.forEach(route => server.addRoute(route))

server.configureRoutes()

export default app


//app.use('/api', router);
// Endpoint /api/health en router

/*

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

*/
