
// Conexion Estadisticas
const conexion = require('./conexionBD');

// Estadisticas
const estadistica = async (idMateria, idCarrera, nacionalidad) => {
    try {
        const consulta = `CALL procEstadistica(?, ?, ?)`;
        const [results] = await conexion.query(consulta, [idMateria, idCarrera, nacionalidad]);


        const estadisticas = {
            estadistica1: results[0][0].estadistica1,
            estadistica2: results[0][0].estadistica2,
            estadistica3: results[0][0].estadistica3,
            estadistica4: results[0][0].estadistica4,
            estadistica5: results[0][0].estadistica5,
        };

        console.log(estadisticas);
         
        return estadisticas;
    } catch (error) {
        throw new Error(`Error al realizar la consulta a la base de datos: ${error.message}`);
    }
};

module.exports = {
    estadistica,
};
