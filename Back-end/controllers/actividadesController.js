const Actividades = require("../models/actividades");
const Usuario = require('../models/usuario');
const { enviarCorreo } = require('../utils/emailService');

// Crear una nueva actividad
exports.crearActividad = async (req, res) => {
  const { title, description, assignedTo, startDate, endDate, status } = req.body;
  const createdBy = req.user._id;

  try {
      // Crear la actividad
      let actividad = new Actividades({
          title,
          description,
          createdBy,
          assignedTo,
          startDate,
          endDate,
          status
      });

      // Guardar la actividad
      await actividad.save();

      // Buscar información del usuario asignado y del creador
      const usuarioAsignado = await Usuario.findById(assignedTo);
      const usuarioCreador = await Usuario.findById(createdBy);

      // Formatear las fechas para el correo
      const fechaInicio = new Date(startDate).toLocaleDateString('es-ES');
      const fechaFin = new Date(endDate).toLocaleDateString('es-ES');

      // Crear el contenido del correo
      const contenidoCorreo = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Nueva Actividad Asignada</h2>
              <p>Hola ${usuarioAsignado.nombre},</p>
              <p>Se te ha asignado una nueva actividad:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                  <h3 style="color: #333;">${title}</h3>
                  <p><strong>Descripción:</strong> ${description}</p>
                  <p><strong>Fecha de inicio:</strong> ${fechaInicio}</p>
                  <p><strong>Fecha de finalización:</strong> ${fechaFin}</p>
                  <p><strong>Asignado por:</strong> ${usuarioCreador.nombre}</p>
              </div>
              <p>Por favor, revisa los detalles y comienza a trabajar en ella.</p>
              <p>Saludos cordiales,</p>
              <p>Equipo de Gestión de Actividades</p>
          </div>
      `;

      // Enviar el correo
      await enviarCorreo(
          usuarioAsignado.email,
          'Nueva Actividad Asignada: ' + title,
          contenidoCorreo
      );

      res.status(201).json({
          actividad,
          mensaje: 'Actividad creada y notificación enviada exitosamente'
      });

  } catch (error) {
      console.log(error);
      res.status(500).json({
          msg: 'Hubo un error al crear la actividad',
          error: error.message
      });
  }
};

// Obtener todas las actividades
exports.obtenerActividadesPorUsuario = async (req, res) => {
  try {
    const actividades = await Actividades.find({
      $or: [
        { createdBy: req.user._id }, // Actividades creadas por el usuario
        { assignedTo: req.user._id } // Actividades asignadas al usuario
      ]
    })
    .populate('createdBy')
    .populate('assignedTo');

    res.json(actividades);
  } catch (error) {
    console.log(error); // Para ver qué error está ocurriendo en la consola
    res.status(500).send('Hubo un error al obtener las actividades');
  }
};


// Obtener una actividad por ID
exports.obtenerActividades = async (req, res) => {
  try {
      const actividades = await Actividades.find({ createdBy: req.user.id }).populate('assignedTo', 'nombre'); 
      res.status(200).json(actividades);
  } catch (error) {
      res.status(500).json({ message: 'Error al obtener las actividades' });
  }
};



// Actualizar una actividad
exports.actualizarActividad = async (req, res) => {
  const { id } = req.params; // Obtener el ID de los parámetros de la solicitud
  const { title, description, assignedTo, startDate, endDate, status } = req.body;

  try {
      const actividad = await Actividades.findById(id); // Buscar la actividad por ID
      if (!actividad) {
          return res.status(404).json({ error: 'Actividad no encontrada' });
      }

      // Actualizar los campos de la actividad
      actividad.title = title || actividad.title;
      actividad.description = description || actividad.description;
      actividad.assignedTo = assignedTo || actividad.assignedTo;
      actividad.startDate = startDate || actividad.startDate;
      actividad.endDate = endDate || actividad.endDate;
      actividad.status = status || actividad.status;

      // Guardar los cambios en la base de datos
      await actividad.save();

      res.json(actividad); // Devolver la actividad actualizada
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al actualizar la actividad' });
  }
};


// Eliminar una actividad
exports.eliminarActividad = async (req, res) => {
  const { id } = req.params;

  try {
      const actividad = await Actividades.findById(id); // Buscar la actividad por ID
      if (!actividad) {
          return res.status(404).json({ error: 'Actividad no encontrada' });
      }

      await Actividades.findByIdAndDelete(id); // Eliminar la actividad
      res.json({ message: 'Actividad eliminada correctamente' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar la actividad' });
  }
};

// Controlador de actividades
exports.filtrarActividades = async (req, res) => {
  try {
      const { status, employeeName } = req.query;

      // Criterios de búsqueda
      const criteria = {};
      if (status) {
          criteria.status = status;  // Filtra por estatus
      }
      if (employeeName) {
          criteria['assignedTo.nombre'] = { $regex: employeeName, $options: 'i' };  // Filtra por nombre (insensible a mayúsculas)
      }

      // Buscar actividades que cumplan con los criterios
      const actividades = await Actividades.find(criteria)
          .populate('assignedTo', 'nombre')  // Solo obtenemos el campo 'nombre' de 'assignedTo'
          .populate('createdBy', 'nombre'); // Opcional

      res.json(actividades);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al filtrar actividades' });
  }

};

exports.iniciarActividad = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la actividad desde los parámetros

  try {
      const actividad = await Actividades.findById(id);
      if (actividad && actividad.status === 'Pendiente') {
          actividad.status = 'En Progreso';
          actividad.actualStartDate = new Date(); // Guardar la fecha y hora de inicio
          await actividad.save();
          res.status(200).json(actividad);
      } else {
          res.status(400).send('La actividad no se puede iniciar o ya está en progreso.');
      }
  } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error al iniciar la actividad');
  }
};

exports.completarActividad = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la actividad desde los parámetros

  try {
      const actividad = await Actividades.findById(id);
      if (actividad && actividad.status === 'En Progreso') {
          actividad.status = 'Completada';
          actividad.actualEndDate = new Date(); // Guardar la fecha y hora de finalización
          await actividad.save();
          res.status(200).json(actividad);
      } else {
          res.status(400).send('La actividad no se puede completar o no está en progreso.');
      }
  } catch (error) {
      console.log(error);
      res.status(500).send('Hubo un error al completar la actividad');
  }
};

// Verificar actividad
exports.verificarActividad = async (req, res) => {
  const { id } = req.params;

  try {
    const actividad = await Actividades.findById(id);
    
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    // Aquí puedes agregar la lógica para cambiar el estado de la actividad si es necesario
    actividad.status = 'Completada';
    await actividad.save();

    return res.status(200).json({ message: 'Actividad verificada.', actividad });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al verificar la actividad.' });
  }
};

