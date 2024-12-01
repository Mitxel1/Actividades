// reporteSchema.js
const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    contenido: { type: String, required: true },
    creadoPor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuario',
        required: true 
    },
    fechaCreacion: { type: Date, default: Date.now }
});

const reporteSchema = mongoose.Schema({
    actividad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actividades',
        required: true
    },
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    recursos: [String],
    problemas: [String],
    soluciones: [String],
    comentariosAdmin: [comentarioSchema],
    estado: {
        type: String,
        enum: ['Pendiente de Revisión', 'Revisado', 'Requiere Cambios'],
        default: 'Pendiente de Revisión'
    },
    creadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    fechaCreacion: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reporte', reporteSchema);