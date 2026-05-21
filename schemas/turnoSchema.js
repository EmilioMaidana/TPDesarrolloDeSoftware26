import mongoose from "mongoose";

import { EstadoTurno } from "../domain/Enums.js";
import { cambioEstadoTurnoSchema } from "./CambioEstadoTurnoSchema.js";
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

  eliminado: {
    type: Boolean,
    default: false,
  }

},

{
  timestamps: true,
  collection: "turnos",
});

turnoSchema.loadClass(TurnoClass);

turnoSchema.set("toJSON", {
  versionKey: false,
});

export const TurnoModel =
mongoose.model(
  "Turno",
  turnoSchema
);