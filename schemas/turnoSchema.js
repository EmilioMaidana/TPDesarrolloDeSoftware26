import mongoose from "mongoose";

import { EstadoTurno } from "../domain/Enums.js";
import { cambioEstadoTurnoSchema } from "./cambioEstadoTurnoSchema.js";
import { Turno as TurnoClass } from "../domain/Turno.js";

const turnoSchema = new mongoose.Schema({

  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medico",
    required: true,
  },

  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
  },

  fechaHora: {
    type: Date,
    required: true,
  },

  sede: {
    nombre: String,
    direccion: String,
  },

  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "servicioTipo",
    required: true,
  },

  servicioTipo: {
    type: String,
    enum: ["Especialidad", "Practica"],
    required: true,
  },

  estado: {
    type: String,
    enum: Object.values(EstadoTurno),
    default: EstadoTurno.DISPONIBLE,
  },

  historialEstados: {
    type: [cambioEstadoTurnoSchema],
    default: [],
  },

  costo: {
    type: Number,
    required: true,
    min: 0,
  },

  motivoCancelacion: {
    type: String,
    trim: true,
  },

  fechaPropuesta: {
    type: Date,
  },

  eliminado: {
    type: Boolean,
    default: false,
  }

},

{
  timestamps: true,
  collection: "turnos",
});

// indices para busquedas eficientes
turnoSchema.index({ medico: 1, fechaHora: 1 });
turnoSchema.index({ estado: 1, fechaHora: 1 });
turnoSchema.index({ paciente: 1 });
turnoSchema.index({ servicio: 1 });

turnoSchema.loadClass(TurnoClass);// carga los metodos que usa tiene turno


export const TurnoModel = mongoose.model("Turno", turnoSchema);
