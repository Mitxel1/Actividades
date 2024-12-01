// controllers/reporteController.js
const Reporte = require('../models/reporteSchema');
const Actividades = require('../models/actividades'); // Asegúrate de que Actividades esté importado correctamente
const ReporteBuilder = require('../builders/ReporteBuilder');

const reporteController = {
    // Crear un nuevo reporte
    crearReporte: async (req, res) => {
        const { actividadId } = req.params;

        try {
            // Verificar que el usuario esté autenticado
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            // Validar que el campo contenido esté presente
            const { titulo, contenido, recursos = [], problemas = [], soluciones = [] } = req.body;


            if (!titulo) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo contenido es obligatorio'
                });
            }

            if (!contenido) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo contenido es obligatorio'
                });
            }

            // Buscar la actividad por su ID
            const actividad = await Actividades.findById(actividadId);
            if (!actividad) {
                return res.status(404).json({
                    success: false,
                    message: 'Actividad no encontrada'
                });
            }

            // Construir el reporte usando ReporteBuilder
            const builder = new ReporteBuilder();
            const reporteData = builder
                .setActividad(actividadId)
                .setTitulo(titulo)
                .setContenido(contenido)
                .setCreadoPor(req.user._id) // Usar el ID del usuario de la decodificación del token
                .build();

            // Agregar arrays de recursos, problemas y soluciones
            if (Array.isArray(recursos)) {
                recursos.forEach(recurso => builder.addRecurso(recurso));
            }
            if (Array.isArray(problemas)) {
                problemas.forEach(problema => builder.addProblema(problema));
            }
            if (Array.isArray(soluciones)) {
                soluciones.forEach(solucion => builder.addSolucion(solucion));
            }
            const nuevoReporte = new Reporte(reporteData);
            await nuevoReporte.save();

            res.status(201).json({
                success: true,
                data: nuevoReporte
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    //obtener
    obtenerReporte: async (req, res) => {
        try {
            const { reporteId } = req.params;
            
            const reporte = await Reporte.findById(reporteId)
                .populate('actividad')
                .populate('creadoPor', 'nombre email')
                .populate('comentariosAdmin.creadoPor', 'nombre email');

            if (!reporte) {
                return res.status(404).json({
                    success: false,
                    message: 'Reporte no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: reporte
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Obtener reportes por actividad
    obtenerReportesPorActividad: async (req, res) => {
        try {
            const { actividadId } = req.params;
            
            const reportes = await Reporte.find({ actividad: actividadId })
                .populate('creadoPor', 'nombre email')
                .populate('comentariosAdmin.creadoPor', 'nombre email')
                .sort({ fechaCreacion: -1 });

            res.status(200).json({
                success: true,
                data: reportes
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },



    // Agregar comentario del admin
    agregarComentarioAdmin: async (req, res) => {
        try {
            const { reporteId } = req.params;
            const { contenido } = req.body;
    
            const reporte = await Reporte.findById(reporteId);
            if (!reporte) {
                return res.status(404).json({
                    success: false,
                    message: 'Reporte no encontrado'
                });
            }
    
            reporte.comentariosAdmin.push({
                contenido,
                creadoPor: req.user._id // Cambiado de req.usuario._id a req.user._id
            });
    
            await reporte.save();
    
            res.status(200).json({
                success: true,
                data: reporte
            });
    
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Actualizar estado del reporte
    actualizarEstadoReporte: async (req, res) => {
        try {
            const { reporteId } = req.params;
            const { estado } = req.body;

            const reporte = await Reporte.findById(reporteId);
            if (!reporte) {
                return res.status(404).json({
                    success: false,
                    message: 'Reporte no encontrado'
                });
            }

            reporte.estado = estado;
            await reporte.save();

            res.status(200).json({
                success: true,
                data: reporte
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Otros métodos (agregar comentario, actualizar estado, obtener reporte, etc.)
};

module.exports = reporteController;


