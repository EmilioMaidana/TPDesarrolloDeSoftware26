import express from 'express';

export function createAuthRoutes(authController) {
    const router = express.Router();

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Iniciar sesión con usuario y contraseña
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [nombreUsuario, password]
     *             properties:
     *               nombreUsuario: { type: string, example: paciente.juan }
     *               password: { type: string, example: "123" }
     *     responses:
     *       200:
     *         description: Perfil del usuario autenticado
     *       401:
     *         description: Credenciales inválidas
     */
    router.post('/login', (req, res, next) => authController.login(req, res, next));

    return router;
}
