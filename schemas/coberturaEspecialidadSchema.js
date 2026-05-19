import mongoose from "mongoose";

import { NivelCobertura } from "../domain/Enums.js";

export const coberturaEspecialidadSchema = new mongoose.Schema({

  especialidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Especialidad",
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