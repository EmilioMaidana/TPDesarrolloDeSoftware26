export class PacienteController {

    constructor(pacienteService) {
        this.pacienteService = pacienteService;
    }

    // GET /api/pacientes
    async listar(req, res, next) {
        try {
            const pacientes = await this.pacienteService.listar();
            res.json(pacientes);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/pacientes/:id
    async obtener(req, res, next) {
        try {
            const paciente = await this.pacienteService.obtener(req.params.id);
            res.json(paciente);
        } catch (error) {
            next(error);
        }
    }
}
