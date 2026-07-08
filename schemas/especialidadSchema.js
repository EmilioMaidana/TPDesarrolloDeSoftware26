import mongoose from "mongoose";

const especialidadSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  duracionTurnoEnMins: {
    type: Number,
    required: true,
    min: 1,
  },

  costoConsulta: {
    type: Number,
    required: true,
    min: 0,
  },

  eliminado: {
    type: Boolean,
    default: false,
  }

},
{
  timestamps: true,
  collection: "especialidades",
});

especialidadSchema.set("toJSON", {
  versionKey: false,
});

export const EspecialidadModel = mongoose.model(
  "Especialidad",
  especialidadSchema
);