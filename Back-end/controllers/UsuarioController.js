const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

exports.registro = async (req, res) => {
  try {
    const { nombre,apellidos,email,telefono,departamento,ubicacion,password, rol } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const usuario = new Usuario({
      nombre,
      apellidos,
      email,
      telefono,
      departamento,
      ubicacion,
      password: passwordHash,
      rol
    });

    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { nombre, password } = req.body;
    const usuario = await Usuario.findOne({ nombre });
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { _id: usuario._id, rol: usuario.rol },
      'secreto', // Asegúrate de que esto coincida con la clave en tu middleware checkToken
      { expiresIn: '8h' }
    );

    let mensaje;
    if (usuario.rol === 'admin') {
      mensaje = 'Bienvenido, administrador';
    } else if (usuario.rol === 'empleado') {
      mensaje = 'Bienvenido, empleado';
    } else {
      mensaje = 'Bienvenido, usuario';
    }

    res.json({ 
      mensaje,
      token,
      rol: usuario.rol,
      _id:usuario._id
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


exports.obtenerUsuarios = async (req, res) =>{
    
  try{

      const usuario =  await Usuario.find({ rol: 'empleado' });
      res.json(usuario)

  }catch(error){
      console.log(error);
      res.status(500).send('Hubo un error')
  };
}

exports.actual = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user._id); // Filtra por el usuario autenticado
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error al obtener el usuario');
  }
};

