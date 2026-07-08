export class MedicoController {

    constructor(medicoService) {
        this.medicoService = medicoService;
    }

    // GET /api/medicos
    async listar(req, res, next) {
        try {
            const medicos = await this.medicoService.listar();
            res.json(medicos);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/medicos/:medicoId
    async obtener(req, res, next) {
        try {
            const medico = await this.medicoService.obtener(req.params.medicoId);
            res.json(medico);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/sedes
    async listarSedes(req, res, next) {
        try {
            const sedes = await this.medicoService.listarSedes();
            res.json(sedes);
        } catch (error) {
            next(error);
        }
    }
}
