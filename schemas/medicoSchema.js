import mongoose from "mongoose";

import { disponibilidadHorariaSchema } from "./DisponibilidadHorariaSchema.js";
import { Medico as MedicoClass } from "../domain/Medico.js";

const medicoSchema = new mongoose.Schema({

  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  matricula: {
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

  especialidades: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialidad",
    }],
    default: [],
  },

  practicas: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Practica",
    }],
    default: [],
  },

  sedes: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },

  disponibilidades: {
    type: [disponibilidadHorariaSchema],
    default: [],
  },

  eliminado: {
    type: Boolean,
    default: false,
  }

},

{
  timestamps: true,
  collection: "medicos",
});

medicoSchema.loadClass(MedicoClass);

medicoSchema.set("toJSON", {
  versionKey: false,
});

export const MedicoModel =
mongoose.model(
  "Medico",
  medicoSchema
);