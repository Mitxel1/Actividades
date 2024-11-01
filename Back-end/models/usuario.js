const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true},         // Nombre del usuario
    apellidos: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required:true, unique: true},
    departamento: { type: String, required:true},
    ubicacion: { type: String, required:true},
    password: { type: String, required: true },     // Contraseña encriptada
    rol: { type: String, enum: ['admin', 'empleado'], required: true,  // Rol del usuario
  }
});

module.exports = mongoose.model('usuario',usuarioSchema);


