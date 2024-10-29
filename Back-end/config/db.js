const mongoose = require('mongoose');
require('dotenv').config({path:'variable.env'});

const conectarDB = async () => {
    mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conected to Mongodb")) /// mensage conecto 
    .catch((error)=> console.error(error)); // error que fallo


}

module.exports = conectarDB;