import mongoose from 'mongoose';
import { TurnoModel } from './schemas/turnoSchema.js';
import { MedicoModel } from './schemas/medicoSchema.js';
import { PacienteModel } from './schemas/pacienteSchema.js';

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27018/SweetMedical');
    
    // get a patient user ID
    const paciente = await PacienteModel.findOne();
    console.log("Paciente ID:", paciente._id);
    console.log("Paciente Usuario ID:", paciente.usuario);
    
    const p1 = await PacienteModel.findOne({ $or: [{ _id: paciente.usuario }, { usuario: paciente.usuario }] });
    console.log("Found patient by usuario ID:", p1 ? "YES" : "NO");

    const t = await TurnoModel.findOne().populate('medico');
    console.log("Turno medico populated?", t.medico._id !== undefined);
    console.log("Medico from turno has usuario?", t.medico.usuario !== undefined);
    
    mongoose.disconnect();
}

test().catch(console.error);
