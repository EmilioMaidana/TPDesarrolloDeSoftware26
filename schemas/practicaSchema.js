import mongoose from "mongoose";

const practicaSchema = new mongoose.Schema({

  codigo: {
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
  collection: "practicas",
});

practicaSchema.set("toJSON", {
  versionKey: false,
});

export const PracticaModel = mongoose.model(
  "Practica",
  practicaSchema
);