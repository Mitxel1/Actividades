const mongoose = require('mongoose');

const actividadesSchema = mongoose.Schema({
    title: { type: String, required: true },            // Título de la actividad
    description: { type: String, required: true },      // Descripción de la actividad
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuario',                                 // Referencia al administrador que crea la actividad
        required: true 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'usuario',                                 // Referencia al empleado asignado a la actividad
        required: true 
    },
    startDate: { type: String, required: true },          // Fecha de inicio planificada de la actividad
    endDate: { type: String, required: true },            // Fecha de fin planificada de la actividad
    createdAt: { type: Date, default: Date.now },       // Fecha de creación de la actividad
    actualStartDate: { type: String },                    // Fecha y hora de inicio real
    actualEndDate: { type: String },                      // Fecha y hora de finalización real
    status: { 
        type: String,
        enum: ['Pendiente', 'En Progreso', 'Completada'], 
        default: 'Pendiente'                            // Estatus inicial
    }
}, { timestamps: true });


module.exports = mongoose.model('Actividades',actividadesSchema);