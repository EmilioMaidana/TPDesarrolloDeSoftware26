import mongoose from "mongoose";

import { Paciente as PacienteClass } from "../domain/Paciente.js";
import "./usuarioSchema.js";

const pacienteSchema = new mongoose.Schema({

   usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  

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
    ref: "ObraSocial",
    required: true,
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },

  eliminado: {
    type: Boolean,
    default: false,
  }

},
{
  timestamps: true,
  collection: "pacientes",
});

pacienteSchema.loadClass(PacienteClass);

pacienteSchema.set("toJSON", {
  versionKey: false,
});

export const PacienteModel = mongoose.model("Paciente", pacienteSchema);
