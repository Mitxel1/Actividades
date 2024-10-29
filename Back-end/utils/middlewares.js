const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: "Debes incluir la cabecera 'Authorization'" });
    }

    // Asumiendo que el formato del header es 'Bearer <token>'
    const token = authHeader.split(' ')[1]; // Obtener el token después de 'Bearer'

    if (!token) {
        return res.status(401).json({ error: "Token no encontrado" });
    }

    try {
        const payload = jwt.verify(token, 'secreto'); // Cambia 'secreto' por tu clave secreta
        req.user = payload; // Almacena el payload decodificado en la solicitud
        next(); // Continúa con el siguiente middleware
    } catch (error) {
        return res.status(401).json({ error: 'El token no es válido' });
    }
};

module.exports = { checkToken };

