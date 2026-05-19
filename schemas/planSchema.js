import mongoose from "mongoose";

import { coberturaEspecialidadSchema }
from "./CoberturaEspecialidadSchema.js";

import { coberturaPracticaSchema }
from "./CoberturaPracticaSchema.js";

const planSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    trim: true,
  },

  coberturasEspecialidad: {
    type: [coberturaEspecialidadSchema],
    default: [],
  },

  coberturasPracticas: {
    type: [coberturaPracticaSchema],
    default: [],
  },

  eliminado: {
    type: Boolean,
    default: false,
  }

},
{
  timestamps: true,
  collection: "planes",
});

planSchema.set("toJSON", {
  versionKey: false,
});

export const PlanModel =
mongoose.model("Plan", planSchema);