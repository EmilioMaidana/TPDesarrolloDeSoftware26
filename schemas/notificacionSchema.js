import mongoose from "mongoose";

import {Notificacion as NotificacionClass} from "../domain/Notificacion.js";

const notificacionSchema =
new mongoose.Schema({

  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  remitente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  mensaje: {
    type: String,
    required: true,
    trim: true,
  },

  fechaHoraCreacion: {
    type: Date,
    default: Date.now,
  },

  fechaHoraLeida: {
    type: Date,
  },

  leida: {
    type: Boolean,
    default: false,
  }

},

{
  timestamps: true,
  collection: "notificaciones",
});


// CARGA MÉTODOS DE LA CLASE
notificacionSchema.loadClass(NotificacionClass);


notificacionSchema.set("toJSON", {
  versionKey: false,
});


export const NotificacionModel =
mongoose.model(
  "Notificacion",
  notificacionSchema
);