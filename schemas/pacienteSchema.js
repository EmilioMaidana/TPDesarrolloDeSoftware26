import mongoose from "mongoose";

import { Paciente as PacienteClass } from "../models/entities/paciente.js";

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
*/