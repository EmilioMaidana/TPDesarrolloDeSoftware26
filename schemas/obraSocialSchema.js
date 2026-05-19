import mongoose from "mongoose";

const obraSocialSchema =
new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  planes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    }],
    default: [],
  },

  eliminado: {
    type: Boolean,
    default: false,
  }

},
{
  timestamps: true,
  collection: "obrasSociales",
});

obraSocialSchema.set("toJSON", {
  versionKey: false,
});

export const ObraSocialModel =
mongoose.model(
  "ObraSocial",
  obraSocialSchema
);