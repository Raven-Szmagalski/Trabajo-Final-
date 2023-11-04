//Se encarga de exportar la configuración necesaria para la conexión con la base de datos 
require('dotenv').config();

const { PORT, DATABASE, USER, PASSWORD } = process.env;

const config = {
  port: PORT || "",
  database: DATABASE || "",
  user: USER || "",
  password: PASSWORD || "",
};

module.exports = config;

