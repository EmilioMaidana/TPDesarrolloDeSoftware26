import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SweetMedical API',
      version: '2.0.0',
      description: 'API REST para el Sistema de Gestión de Turnos Médicos - TP Desarrollo de Software',
    },
    servers: [
      {
        url: process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor',
      },
    ],
    tags: [
      { name: 'Turnos', description: 'Gestión del ciclo de vida de turnos' },
      { name: 'Búsqueda', description: 'Búsqueda de turnos disponibles con cotización' },
      { name: 'Médicos', description: 'Gestión de disponibilidad y servicios médicos' },
      { name: 'Servicios', description: 'Alta, baja y modificación de servicios médicos' },
      { name: 'Pacientes', description: 'Consulta de pacientes y su cobertura' },
      { name: 'Notificaciones', description: 'Visualización y gestión de notificaciones' },
      { name: 'Sistema', description: 'Endpoints utilitarios (health check)' },
    ],
  },
  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
