import mongoose from "mongoose";

import { EstadoTurno } from "../domain/Enums.js";

export const cambioEstadoTurnoSchema = new mongoose.Schema({

  fechaHoraDeIngreso: {
    type: Date,
    required: true,
    default: Date.now,
  },

  estado: {
    type: String,
    enum: Object.values(EstadoTurno),
    required: true,
  },

  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  motivo: {
    type: String,
    trim: true,
  }
},

{
  _id: false,
});