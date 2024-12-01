const express = require('express');
const mongoose = require('mongoose')
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');

const whileList = ['http://localhost:4200']
require ("dotenv").config();

app.use(cors({origin: whileList}));

const port = process.env.port || 3000;
app.use(express.json());
app.use(bodyParser.json());

app.use('/actividades', require('./routes/actividades'));
app.use('/usuario',require('./routes/usuario'));
app.use('/api',require('./routes/reporteRoutes'));

mongoose
.connect(process.env.MONGO_URI) // llamado ala url que proporciona mongo desde .env
.then(() => console.log("Conected to Mongodb")) /// mensage conecto 
.catch((error)=> console.error(error)); // error que fallo

app.listen(port,()=>{ console.log("Servidor Corriendo", port);});