import mongoose from 'mongoose';
import { TurnoModel } from './schemas/turnoSchema.js';
import { MedicoModel } from './schemas/medicoSchema.js';
import { PacienteModel } from './schemas/pacienteSchema.js';
import { NotificacionModel } from './schemas/notificacionSchema.js';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    
    // get a patient user ID
    const paciente = await PacienteModel.findOne();
    const usuarioId = paciente.usuario.toString(); // API receives it as string

    const turno = await TurnoModel.findOne().populate('medico');
    
    // Simulating TurnoService.cancelar logic for patient
    let isPaciente = await PacienteModel.findOne({ 
        eliminado: false, 
        $or: [{ _id: usuarioId }, { usuario: usuarioId }] 
    });

    console.log("Is Paciente?", isPaciente !== null);
    
    if (isPaciente) {
        const medico = turno.medico._id ? turno.medico : null;
        console.log("Medico exists?", medico !== null);
        
        if (medico) {
            console.log("Destinatario:", medico.usuario);
            console.log("Remitente:", usuarioId);
            
            const notif = new NotificacionModel({
                destinatario: medico.usuario,
                remitente: usuarioId,
                mensaje: "Un paciente ha cancelado su turno..."
            });
            await notif.save();
            console.log("Notificacion guardada exitosamente");
        }
    }
    
    mongoose.disconnect();
}

test().catch(console.error);
