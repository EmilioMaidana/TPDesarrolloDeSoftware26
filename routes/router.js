import express from 'express';
import { createTurnoRoutes } from './turnoRoutes.js';
import { createNotificacionRoutes } from './notificacionRoutes.js';
import { createMedicoRoutes } from './medicoRoutes.js';
import { createServicioRoutes } from './servicioRoutes.js';
import { createPacienteRoutes } from './pacienteRoutes.js';
import { createAuthRoutes } from './authRoutes.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

export function createRouter(controllers) {
    const router = express.Router();

    const {
        turnoController,
        notificacionController,
        disponibilidadController,
        servicioController,
        medicoController,
        pacienteController,
        authController
    } = controllers;

    // Rutas públicas
    router.use('/auth', createAuthRoutes(authController));

    // Rutas protegidas (Requieren JWT)
    router.use('/turnos', verificarToken, createTurnoRoutes(turnoController));
    router.use('/notificaciones', verificarToken, createNotificacionRoutes(notificacionController));
    router.use('/medicos', verificarToken, createMedicoRoutes(disponibilidadController, servicioController, medicoController, turnoController));
    router.use('/servicios', verificarToken, createServicioRoutes(servicioController));
    router.use('/pacientes', verificarToken, createPacienteRoutes(pacienteController, turnoController));

    /**
     * @swagger
     * /api/sedes:
     *   get:
     *     summary: Listar sedes de atencion disponibles
     *     tags: [Médicos]
     *     responses:
     *       200:
     *         description: Lista de sedes (nombre y direccion)
     */
    router.get('/sedes', (req, res, next) => medicoController.listarSedes(req, res, next));

    /**
     * @swagger
     * /api/health:
     *   get:
     *     summary: Health check del sistema
     *     tags: [Sistema]
     *     responses:
     *       200:
     *         description: El servicio esta operativo
     */
    router.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    return router;
}