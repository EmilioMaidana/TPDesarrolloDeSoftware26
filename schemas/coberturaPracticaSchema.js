import mongoose from "mongoose";

import { NivelCobertura } from "../domain/Enums.js";

export const coberturaPracticaSchema = new mongoose.Schema({

  practica: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Practica",
    required: true,
  },

  nivel: {
    type: String,
    enum: Object.values(NivelCobertura),
    required: true,
  },

  porcentaje: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },

},
{
  _id: false,
});