import mongoose from "mongoose";

// Define el esquema de la empresa
const empresaSchema = new mongoose.Schema({
  id_creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nombre: {
    type: String,
    required: true,
  },
  razonSocial: {
    type: String,
    required: true,
  },
  identificacionTributaria: {
    type: String,
    unique: true,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  // Industria: Sector en el que laboran
  //  puede ser:
  // - Servicios
  // - Manufactura
  // - Comercio
  // - Construcción
  // - Tecnología etc
  industria: String,

  plazas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plaza'
    }
  ]

});


const Empresa = mongoose.model('Empresa', empresaSchema);

module.exports = Empresa;