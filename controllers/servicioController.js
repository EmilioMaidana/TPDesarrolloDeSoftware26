export class ServicioController {

    constructor(servicioService) {
        this.servicioService = servicioService;
    }

    // GET /api/medicos/:medicoId/servicios
    async listarServiciosDeMedico(req, res, next) {
        try {
            const servicios = await this.servicioService.listarServiciosDeMedico(req.params.medicoId);
            res.json(servicios);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/medicos/:medicoId/servicios
    async altaServicio(req, res, next) {
        try {
            const { tipo, servicioId } = req.body;
            if (!tipo || !servicioId) {
                return res.status(400).json({ message: 'tipo y servicioId son obligatorios' });
            }
            const medico = await this.servicioService.altaServicio(req.params.medicoId, tipo, servicioId);
            res.status(201).json({ message: 'Servicio agregado exitosamente', medico });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/medicos/:medicoId/servicios/:servicioId?tipo=Especialidad
    async bajaServicio(req, res, next) {
        try {
            const { tipo } = req.query;
            if (!tipo) {
                return res.status(400).json({ message: 'El parámetro tipo es obligatorio (Especialidad o Practica)' });
            }
            const medico = await this.servicioService.bajaServicio(req.params.medicoId, tipo, req.params.servicioId);
            res.json({ message: 'Servicio eliminado exitosamente', medico });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/servicios/especialidades
    async listarEspecialidades(req, res, next) {
        try {
            const especialidades = await this.servicioService.listarEspecialidades();
            res.json(especialidades);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/servicios/practicas
    async listarPracticas(req, res, next) {
        try {
            const practicas = await this.servicioService.listarPracticas();
            res.json(practicas);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/servicios/especialidades
    async crearEspecialidad(req, res, next) {
        try {
            const especialidad = await this.servicioService.crearEspecialidad(req.body);
            res.status(201).json(especialidad);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/servicios/practicas
    async crearPractica(req, res, next) {
        try {
            const practica = await this.servicioService.crearPractica(req.body);
            res.status(201).json(practica);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/servicios/especialidades/:id
    async actualizarEspecialidad(req, res, next) {
        try {
            const especialidad = await this.servicioService.actualizarEspecialidad(req.params.id, req.body);
            res.json(especialidad);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/servicios/practicas/:id
    async actualizarPractica(req, res, next) {
        try {
            const practica = await this.servicioService.actualizarPractica(req.params.id, req.body);
            res.json(practica);
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/servicios/especialidades/:id
    async eliminarEspecialidad(req, res, next) {
        try {
            await this.servicioService.eliminarEspecialidad(req.params.id);
            res.json({ message: 'Especialidad eliminada' });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/servicios/practicas/:id
    async eliminarPractica(req, res, next) {
        try {
            await this.servicioService.eliminarPractica(req.params.id);
            res.json({ message: 'Práctica eliminada' });
        } catch (error) {
            next(error);
        }
    }
}
