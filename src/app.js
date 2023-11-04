// Importación de módulos
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const passport = require("passport");
require('./config/passport');

const app = express();

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(cors());

// Ruta de prueba 
app.get('/', (req, res) => {
  const saludo = { estado: true, mensaje: '¡Bienvenido!' };
  res.status(200).json(saludo);
});

// Secciones:

//-----------------------Acceder a Archivos-----------------------//

app.get('/archivos/:nombreArchivo', (req, res) => {
  const nombreArchivo = req.params.nombreArchivo;
  const filePath = path.resolve(__dirname, 'src', 'archivos', nombreArchivo);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Archivo no encontrado');
  }
});


//---------------------------Perfil Bedel---------------------------//

//Importación de rutas:

// - Verificar el perfil de Bedel:  
const { esBedel } = require('./middlewares/esBedel');
 
// - Correo
const v1Publico = require('./V1/routes/publico');

// - Autenticacion
const v1Auth = require('./V1/routes/auth');

// - Estudiante, carrera, materia
const v1Estudiantes = require('./V1/routes/estudiantesRoutes');
const v1Carreras = require('./V1/routes/carrerasRoutes');
const v1Materias = require('./V1/routes/materiasRoutes');

// - Inscripciones
const v1InscripcionMateria = require('./V1/routes/inscripMatRouters');
const v1InscripcionCarrera = require('./V1/routes/inscripCarRouters');

// - Carrera & Materia
const v1CarreraMateria = require('./V1/routes/carreraMateriaRouters');


//Uso de las rutas:

// - Correo
app.use('/v1/api/', v1Publico);

// - Autenticacion
app.use('/v1/api/', v1Auth);

// - Estudiante, carrera, materia
app.use('/v1/api/',[passport.authenticate('jwt', {session: false}), esBedel],v1Estudiantes);
app.use('/v1/api/',[passport.authenticate('jwt', {session: false}), esBedel], v1Carreras);
app.use('/v1/api/',[passport.authenticate('jwt', {session: false}), esBedel], v1Materias);

// - Inscripciones
app.use('/v1/api/', v1InscripcionMateria);
app.use('/v1/api/', v1InscripcionCarrera);

// - Carrera & Materia
app.use('/v1/api/', v1CarreraMateria);


//---------------------------Perfil Decano---------------------------//

//Importación de rutas:

// - Verificar el perfil de Decano
const { esDecano } = require('./middlewares/esDecano');

// - Estadisticas
const v1Estadisticas = require('./V1/routes/estadisticasRoutes');


//Uso de las rutas:

// - Estadisticas
app.use('/v1/api/', [passport.authenticate('jwt', {session: false}), esDecano],v1Estadisticas);


module.exports = app;

