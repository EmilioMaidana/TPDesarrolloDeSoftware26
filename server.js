import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { MongoDBClient } from './config/database.js';

const port = process.env.PORT || 3000;
const host = 'localhost';

async function startServer() {
    try {
        // Conectar a MongoDB
        await MongoDBClient.connect();

        // Iniciar servidor
        app.listen(port, host, () => {
            console.log(`🚀 Servidor corriendo en http://${host}:${port}`);
            console.log(`📚 Documentación Swagger en http://${host}:${port}/api-docs`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();