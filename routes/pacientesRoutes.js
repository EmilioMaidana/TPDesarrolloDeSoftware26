import { TurnoService } from "../services/turnoService.js"
import { TurnoRepository } from "../repositories/turnoRepository.js"
import { TurnoController } from "../controllers/turnoController.js"
import express from "express"
import {disponibilidadController} from "./disponibilidadRoutes.js"

const turnoController = new TurnoController()

const pathTurnos = "/turnos";

export default function reservaTurnos(getController) {

    const router = express.Router();
    const controller1 = getController(disponibilidadController);
    const controller2 = getController(TurnoController);

    router.get(pathTurnos, (req, res, next) => {
        controller1.findAll(req, res, next);
    });

    router.post(pathTurnos, (req, res, next) => {
        controller2.create(req, res, next);
    });

    router.delete(pathTurnos, (req, res, next) => {
        controller2.softDelete(req, res, next);
    });

    router.get(pathTurnos, (req, res, next) => {
        controller2.findAll(req, res, next);
    });
}
