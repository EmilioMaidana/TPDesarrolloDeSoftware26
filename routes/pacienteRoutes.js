import express from 'express';

export function createPacienteRoutes(pacienteController) {
    const router = express.Router();

    /**
     * @swagger
     * /api/pacientes:
     *   get:
     *     summary: Listar pacientes
     *     tags: [Pacientes]
     *     responses:
     *       200:
     *         description: Lista de pacientes
     */
    router.get('/', (req, res, next) => pacienteController.listar(req, res, next));

    /**
     * @swagger
     * /api/pacientes/{id}:
     *   get:
     *     summary: Obtener un paciente con su obra social y plan
     *     tags: [Pacientes]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *         description: ID del paciente o de su usuario
     *     responses:
     *       200:
     *         description: Datos del paciente, su obra social y plan de cobertura
     */
    router.get('/:id', (req, res, next) => pacienteController.obtener(req, res, next));

    return router;
}
