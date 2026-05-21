import mongoose from "mongoose";

import { coberturaEspecialidadSchema } from "./CoberturaEspecialidadSchema.js";
import { coberturaPracticaSchema } from "./CoberturaPracticaSchema.js";
import { Plan as PlanClass } from "../domain/Plan.js";

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

// CARGA MÉTODOS DE LA CLASE
planSchema.loadClass(PlanClass);

planSchema.set("toJSON", {
  versionKey: false,
});

export const PlanModel =
mongoose.model("Plan", planSchema);