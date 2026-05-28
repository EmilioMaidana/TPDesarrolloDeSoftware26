import express from 'express';
import { createTurnoRoutes } from './turnoRoutes.js';
import { createNotificacionRoutes } from './notificacionRoutes.js';
import { createMedicoRoutes } from './medicoRoutes.js';
import { createServicioRoutes } from './servicioRoutes.js';

export function createRouter(controllers) {
    const router = express.Router();

    const { turnoController, notificacionController, disponibilidadController, servicioController } = controllers;

    // Montar sub-routers
    router.use('/turnos', createTurnoRoutes(turnoController));
    router.use('/notificaciones', createNotificacionRoutes(notificacionController));
    router.use('/medicos', createMedicoRoutes(disponibilidadController, servicioController));
    router.use('/servicios', createServicioRoutes(servicioController));

    // Health check
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    return router;
}