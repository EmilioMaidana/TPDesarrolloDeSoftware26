import express from "express"
import { TurnoController } from "../controllers/turnoController.js"
import { TurnoService } from "../services/turnoService.js"
import { TurnoRepository } from "../repositories/turnoRepository.js"

const turnoController = new TurnoController()

const router = express.Router()

router.route('/turnos')
	.get((req, res, next) => turnoController.findAll(req, res, next))
	.post((req, res, next) => turnoController.create(req, res, next))


	/*
	
	router.route('/disponibles')
	.get((req, res, next) => turnoController.findAll(req, res, next))
	.post((req, res, next) => turnoController.create(req, res, next))
	
	*/

	/*router.route('/:id')
	.get((req, res, next) => productoController.findById(req, res, next))
	.put((req, res, next) => productoController.update(req, res, next))
	.delete((req, res, next) => productoController.delete(req, res, next))*/

export default router