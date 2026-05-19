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

},
{
  _id: false,
});