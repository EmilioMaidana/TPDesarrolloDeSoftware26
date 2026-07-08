export class AuthController {

    constructor(authService) {
        this.authService = authService;
    }

    // POST /api/auth/login
    async login(req, res, next) {
        try {
            const { nombreUsuario, password } = req.body;
            if (!nombreUsuario || !password) {
                return res.status(400).json({ message: 'nombreUsuario y password son obligatorios' });
            }
            const perfil = await this.authService.login(nombreUsuario, password);
            res.json(perfil);
        } catch (error) {
            next(error);
        }
    }
}
