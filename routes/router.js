import express from "express"
import { TurnoController } from "../controllers/turnoController.js"
import { TurnoService } from "../services/turnoService.js"
import { TurnoRepository } from "../repositories/turnoRepository.js"

const turnoController = new TurnoController()

const router = express.Router()

const pathTurnos = "/turnos";

export default function reservaTurnos(getController) {
    const router = express.Router();
    const controller = getController(TurnoController);

    router.get(pathTurnos, (req, res, next) => {
        controller.findAll(req, res, next);
    });

    router.post(pathTurnos, (req, res, next) => {
        controller.create(req, res, next);
    });

    router.get(pathTurnos + "/:id", (req, res, next) => {
        controller.findById(req, res, next);
    });

    router.put(pathTurnos + "/:id", (req, res, next) => {
        controller.update(req, res, next);
    });

    router.delete(pathTurnos + "/:id", (req, res, next) => {
        controller.delete(req, res, next);
    });

    router.get( "/reserva/:id/total", (req, res, next) => {
        controller.obtenerReservaConTotal(req, res, next);//falta declarar y modificar
    });

    router.get(pathTurnos + "/estadisticas/reservas-por-alojamiento", (req, res, next) => {
        controller.reservasPorAlojamiento(req, res, next);//falta declarar y modificar
    });

    return router;
}
/*
router.route('/disponibilidades')
	.get((req, res, next) => turnoController.findAll(req, res, next))
	.post((req, res, next) => turnoController.create(req, res, next))
	
	*/

	/*router.route('/:id')
	.get((req, res, next) => productoController.findById(req, res, next))
	.put((req, res, next) => productoController.update(req, res, next))
	.delete((req, res, next) => productoController.delete(req, res, next))
	
router.route('/turnos')
	.get((req, res, next) => turnoController.findAll(req, res, next))
	.post((req, res, next) => turnoController.create(req, res, next))


	*/


export default router