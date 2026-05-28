import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { createRouter } from './routes/router.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorLogger } from './middlewares/errorLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Repositories
import { TurnoRepository } from './repositories/turnoRepository.js';
import { MedicoRepository } from './repositories/medicoRepository.js';
import { PacienteRepository } from './repositories/pacienteRepository.js';
import { NotificacionRepository } from './repositories/notificacionRepository.js';
import { ServicioRepository } from './repositories/servicioRepository.js';

// Services
import { TurnoService } from './service/turnoService.js';
import { NotificacionService } from './service/notificacionService.js';
import { ServicioService } from './service/servicioService.js';
import { DisponibilidadService } from './service/disponibilidadService.js';

// Controllers
import { TurnoController } from './controllers/turnoController.js';
import { NotificacionController } from './controllers/notificacionController.js';
import { ServicioController } from './controllers/servicioController.js';
import { DisponibilidadController } from './controllers/disponibilidadController.js';

// === Inyección de Dependencias ===

// Repositories
const turnoRepository = new TurnoRepository();
const medicoRepository = new MedicoRepository();
const pacienteRepository = new PacienteRepository();
const notificacionRepository = new NotificacionRepository();
const servicioRepository = new ServicioRepository();

// Services
const turnoService = new TurnoService(turnoRepository, pacienteRepository, medicoRepository, notificacionRepository);
const notificacionService = new NotificacionService(notificacionRepository);
const servicioService = new ServicioService(servicioRepository, medicoRepository);
const disponibilidadService = new DisponibilidadService(medicoRepository, turnoRepository, servicioRepository);

// Controllers
const turnoController = new TurnoController(turnoService);
const notificacionController = new NotificacionController(notificacionService);
const servicioController = new ServicioController(servicioService);
const disponibilidadController = new DisponibilidadController(disponibilidadService);

// === App Express ===
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SweetMedical API - Documentación'
}));

// Redirigir la raíz a la documentación
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Rutas API
app.use('/api', createRouter({
    turnoController,
    notificacionController,
    disponibilidadController,
    servicioController
}));

// Middlewares de error (orden importa)
app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

export default app;
