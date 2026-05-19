import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema({

  usuario: {
    type: String,
    required: true
  },

  nombre: {
    type: String,
    required: true
  },

  dni: {
    type: Number,
    required: true,
    unique: true
  },

  obraSocial: {
    type: String,
    required: true
  },

  plan: {
    type: String,
    required: true
  },

  turnosRealizados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turno"
  }]

}, {
  timestamps: true
});

export const Paciente = mongoose.model(
  "Paciente",
  pacienteSchema
);