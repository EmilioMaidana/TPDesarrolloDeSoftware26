import mongoose from "mongoose";

import { disponibilidadHorariaSchema } from "./disponibilidadHorariaSchema.js";
import { sedeSchema } from "./sedeSchema.js";
import "./usuarioSchema.js";
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
    trim: true,// elimina los espacios de comienzo y fin de los string
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
    type: [sedeSchema],
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
  timestamps: true,// cuando se crea guarda la fecha
  collection: "medicos",
});

medicoSchema.loadClass(MedicoClass);

medicoSchema.set("toJSON", {// cuando se actualiza no implementa el versionado
  versionKey: false,
});

export const MedicoModel = mongoose.model("Medico", medicoSchema);
