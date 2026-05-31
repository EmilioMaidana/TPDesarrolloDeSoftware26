export class DisponibilidadController {

    constructor(disponibilidadService) {
        this.disponibilidadService = disponibilidadService;
    }
    

    // POST /api/medicos/:medicoId/disponibilidad
    async crearDisponibilidad(req, res, next) {
        try {
            const resultado = await this.disponibilidadService.crearDisponibilidad(
                req.params.medicoId,
                req.body
            );

            res.status(201).json({
                message: 'Disponibilidad creada y turnos generados',
                ...resultado
            });
        } catch (error) {
            next(error);
        }
    }
    /*
    async crearDisponibilidad(req, res, next){
        //const { medicoId } = req.params;
        try{
            //const{ disponibilidad } = req.query;
            const diponibilidad = await this.disponibilidadService.crearDisponibilidad(req.params,req.body);
            res.status(201).json({message: "se creo la disponibilidad"});
        }catch(error){
            next(error);
        }
    }
*/
    // GET /api/medicos/:medicoId/disponibilidad?servicioId=...
    async consultarDisponibilidad(req, res, next) {
        try {
            const { servicioId } = req.query;
            const disponibilidades = await this.disponibilidadService.consultarDisponibilidad(
                req.params.medicoId,
                servicioId
            );
            res.json(disponibilidades);
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/medicos/:medicoId/disponibilidad
    async actualizarDisponibilidad(req, res, next) {
        try {
            const { disponibilidades } = req.body;
            if (!disponibilidades || !Array.isArray(disponibilidades)) {
                return res.status(400).json({ message: 'Se requiere un array de disponibilidades' });
            }
            const resultado = await this.disponibilidadService.actualizarDisponibilidad(
                req.params.medicoId,
                disponibilidades
            );
            res.json({
                message: 'Disponibilidad actualizada y turnos regenerados',
                ...resultado
            });
        } catch (error) {
            next(error);
        }
    }
}
