import mongoose from "mongoose";

export const sedeSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    trim: true,
  },

  direccion: {
    type: String,
    required: true,
    trim: true,
  }
},

{
  _id: false,
});