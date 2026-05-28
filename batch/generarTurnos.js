import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import cron from 'node-cron';
import { MongoDBClient } from '../config/database.js';

import { MedicoRepository } from '../repositories/medicoRepository.js';
import { TurnoRepository } from '../repositories/turnoRepository.js';
import { ServicioRepository } from '../repositories/servicioRepository.js';
import { BatchService } from '../service/batchService.js';

async function runBatch() {
    console.log(`[${new Date().toISOString()}] Iniciando proceso batch de generación de turnos...`);

    try {
        await MongoDBClient.connect();

        const medicoRepository = new MedicoRepository();
        const turnoRepository = new TurnoRepository();
        const servicioRepository = new ServicioRepository();
        
        const batchService = new BatchService(medicoRepository, turnoRepository, servicioRepository);

        await batchService.generarTurnosParaTodosLosMedicos();

        console.log(`[${new Date().toISOString()}] Proceso batch finalizado exitosamente.`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error en proceso batch:`, error);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
}

// Si se ejecuta directamente (node batch/generarTurnos.js)
if (process.argv[1] && process.argv[1].includes('generarTurnos.js')) {
    runBatch().then(() => process.exit(0));
}

// Programar para que corra todos los días a las 00:00
cron.schedule('0 0 * * *', () => {
    runBatch();
});

export { runBatch };
