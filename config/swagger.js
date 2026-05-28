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
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    tags: [
      { name: 'Turnos', description: 'Gestión del ciclo de vida de turnos' },
      { name: 'Búsqueda', description: 'Búsqueda de turnos disponibles con cotización' },
      { name: 'Médicos', description: 'Gestión de disponibilidad y servicios médicos' },
      { name: 'Notificaciones', description: 'Visualización y gestión de notificaciones' },
      { name: 'Servicios', description: 'Alta, baja y modificación de servicios médicos' },
    ],
  },
  apis: ['./routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
