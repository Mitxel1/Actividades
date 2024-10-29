const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');
const {checkToken} = require ('./../utils/middlewares')

//Post registrar
router.post('/registro',usuarioController.registro);

//post login 
router.post('/login',usuarioController.login);

router.get('/usuarios', usuarioController.obtenerUsuarios);

router.get('/actual',checkToken,usuarioController.actual);

module.exports = router;