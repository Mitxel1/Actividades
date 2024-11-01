//Ruta para eventos
const express = require('express');
const router = express.Router();
const actividadesControllers = require('../controllers/actividadesController');
const {checkToken} = require ('./../utils/middlewares')
//hacer llamado de la funcion 

//crear actividad
router.post('/', checkToken,actividadesControllers.crearActividad);
// Obtener actividades por usuario
router.get('/', checkToken,actividadesControllers.obtenerActividadesPorUsuario);
//Actualizar actividades
router.put('/:id', checkToken,actividadesControllers.actualizarActividad);
//Eliminar actividad
router.delete('/:id',checkToken, actividadesControllers.eliminarActividad);
// actualizar estatus
router.post('/iniciar-actividad/:id',checkToken,actividadesControllers.iniciarActividad);

// Ruta para completar una actividad
router.post('/completar-actividad/:id', checkToken,actividadesControllers.completarActividad);

router.get('/filtrar', checkToken, actividadesControllers.filtrarActividades);

router.put('/verificar/:id',checkToken,actividadesControllers.verificarActividad);

router.get('/actividades', checkToken,actividadesControllers.obtenerActividades);


module.exports = router;