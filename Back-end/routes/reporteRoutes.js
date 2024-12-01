// routes/reporteRoutes.js
const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const {checkToken} = require ('./../utils/middlewares');// Asumiendo que tienes estos middlewares

// Rutas para empleados
router.post('/crear/:actividadId', checkToken, reporteController.crearReporte);
router.get('/actividad/:actividadId', checkToken, reporteController.obtenerReportesPorActividad);
router.get('/:reporteId', checkToken, reporteController.obtenerReporte);

//Rutas para administradores
router.post('/:reporteId/comentario', checkToken, reporteController.agregarComentarioAdmin);
router.put('/:reporteId/estado', checkToken, reporteController.actualizarEstadoReporte);

module.exports = router;