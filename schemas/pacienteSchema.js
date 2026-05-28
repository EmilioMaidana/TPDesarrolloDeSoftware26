import mongoose from "mongoose";

import { Paciente as PacienteClass } from "../domain/Paciente.js";

const pacienteSchema = new mongoose.Schema({

  dni: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  nombre: {
    type: String,
    required: true,
    trim: true,
  },

  obraSocial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ObraSocial",             //por referencia ya que muchos pacientes pueden tener la misma obra social
    required: true,
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },

  // SOFT DELETE
  eliminado: {
    type: Boolean,
    default: false,
  }

},
{
  timestamps: true,
  collection: "pacientes",
});


// Cargar lógica de dominio
pacienteSchema.loadClass(PacienteClass);


// Opcional: ocultar __v
pacienteSchema.set("toJSON", {
  versionKey: false,
});


export const PacienteModel = mongoose.model(
  "Paciente",
  pacienteSchema
);

//asi se crearia un nuevo paciente
/*
const paciente1 = new Paciente({
  nombre: "Juan"
});

await paciente1.save();

*/// Subesquema para Obra Social y Plan (embeber)
const obraSocialInfoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  plan: { type: String, required: true },
  numeroAfiliado: { type: String, required: true }
}, { _id: false }); // No necesitamos un ID interno para este subdocumento

const pacienteSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  dni: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  // Embebemos los datos de la obra social
  obraSocial: obraSocialInfoSchema
}, { timestamps: true });

export default mongoose.model("Paciente", pacienteSchema);