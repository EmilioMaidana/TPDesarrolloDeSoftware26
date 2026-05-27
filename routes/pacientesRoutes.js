import { TurnoService } from "../services/turnoService.js"
import { TurnoRepository } from "../repositories/turnoRepository.js"
import { TurnoController } from "../controllers/turnoController.js"
import express from "express"

const turnoController = new TurnoController()

const pathTurnos = "/turnos";

export default function reservaTurnos(getController) {

    const router = express.Router();
    const controller = getController(TurnoController);

    router.get(pathTurnos, (req, res, next) => {
        controller.findAll(req, res, next);
    });
}
