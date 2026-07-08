import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { MongoDBClient } from './config/database.js';

const port = process.env.PORT || 3000;
// Escuchamos en 0.0.0.0 para quedar accesibles tanto por 127.0.0.1 como por ::1
// (en Windows "localhost" resuelve solo a ::1) y para que funcione el deploy en Render.
const host = process.env.HOST || '0.0.0.0';

async function startServer() {
    try {
        // Conectar a MongoDB
        await MongoDBClient.connect();

        // Iniciar servidor
        app.listen(port, host, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${port}`);
            console.log(`📚 Documentación Swagger en http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();