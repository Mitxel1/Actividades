const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarCorreo = async (destinatario, asunto, contenido) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: destinatario,
            subject: asunto,
            html: contenido
        });
        return { exito: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return { exito: false, error: error.message };
    }
};

module.exports = { enviarCorreo };