import mongoose from "mongoose";

import { NivelCobertura } from "../domain/Enums.js";

export const coberturaEspecialidadSchema = new mongoose.Schema({

  especialidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especialidad",
    required: true,
  },

  // Campo original del schema (preferido)
  nivel: {
    type: String,
    enum: Object.values(NivelCobertura),
    default: null,
  },

  // Porcentaje nombrado según schema Mongoose
  porcentaje: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },

  // Alias leído desde documentos MongoDB existentes
  porcentajeCobertura: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },

},
{
  _id: false,
});