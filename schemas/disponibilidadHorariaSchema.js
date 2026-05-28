import mongoose from "mongoose";

import { DiaSemana } from "../domain/Enums.js";

export const disponibilidadHorariaSchema = new mongoose.Schema({

  diaSemana: {
    type: String,
    enum: Object.values(DiaSemana),
    required: true,
  },

  horaDesde: {
    type: String,
    required: true,
  },

  horaHasta: {
    type: String,
    required: true,
  },

  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "disponibilidades.servicioTipo",
    required: true,
  },

  servicioTipo: {
    type: String,
    enum: ["Especialidad", "Practica"],
    required: true,
  },

  sede: {
    nombre: String,
    direccion: String,
  }
},

{
  _id: false,
});