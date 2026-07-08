import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({

  nombreUsuario: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  usuarioTipo: {
    type: String,
    enum: ["PACIENTE", "MEDICO"],
    required: true,
    trim: true,
  },

  eliminado: {
    type: Boolean,
    default: false,
  }

},
{
  timestamps: true,
  collection: "usuarios",
});

usuarioSchema.set("toJSON", {
  versionKey: false,
});

export const UsuarioModel =
mongoose.model(
  "Usuario",
  usuarioSchema
);