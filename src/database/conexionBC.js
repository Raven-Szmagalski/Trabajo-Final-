
// Conexion Carrera
const conexionBD = require('./conexionBD');

// Busqueda por nombre
const buscarPorNombre = async (nombre) => {
    try {
        const consulta = `SELECT idCarrera, nombre, 
        CASE
            WHEN modalidad = 0 THEN 'virtual'
            WHEN modalidad = 1 THEN 'presencial'
            ELSE ''
        END AS modalidad 
        FROM carrera 
        WHERE activo = 1 AND nombre LIKE ?`;

        const [carreras] = await conexionBD.query(consulta, [`%${nombre}%`]);
        return carreras;

    } catch (error) {
        throw error;
    }
};

// Lista todos las carreras
const listarTodos = async () => {
    try {
        const consulta = `SELECT idCarrera, nombre, 
        CASE
            WHEN modalidad = 0 THEN 'virtual'
            WHEN modalidad = 1 THEN 'presencial'
            ELSE ''
        END AS modalidad 
        FROM carrera 
        WHERE activo = 1`;

        const [carreras] = await conexionBD.query(consulta);
        return carreras;

    } catch (error) {
        throw error;
    }
};

// Busqueda por ID 
const buscarPorId = async (idCarrera) => {

    const consulta = `SELECT  idCarrera, nombre,
    CASE
        WHEN modalidad = 0 THEN 'virtual'
        WHEN modalidad = 1 THEN 'presencial'
        ELSE ''
    END AS modalidad 
    FROM carrera 
    WHERE activo = 1 AND idCarrera = ?`;

    const [carrera] = await conexionBD.query(consulta, [idCarrera]);

    return carrera;

};

// Crea una carrera
const crear = async (carrera) => {
    try {
        const consulta = `
          INSERT INTO carrera (nombre, modalidad, activo)
          VALUES (?, ?, ?)
        `;

        const [carreraNuevo] = await conexionBD.query(consulta, [
            carrera.nombre,
            carrera.modalidad,
            carrera.activo 
        ]);

        return { id: carreraNuevo.insertId, ...carrera }; 
    } catch (error) {
        throw error;
    }
};

// Elimina una carrera
const borrar = async (idCarrera) => {
    const consulta = 'UPDATE carrera SET activo = 0 WHERE idCarrera = ?';
    try {
        console.log('ID de la carrera a eliminar:', idCarrera);
        await conexionBD.query(consulta, [idCarrera]);
        console.log('Carrera eliminada correctamente');
    } catch (error) {
        console.error('Error eliminanda la carrera:', error);
        throw error;
    }
};

// Editar una carrera
const modificar = async (datos, idCarrera) => {
    const consulta = 'UPDATE carrera SET nombre = ?, modalidad = ? WHERE idCarrera = ?';
    
    await conexionBD.query(consulta,[datos.nombre, datos.modalidad, idCarrera]);
    
    return buscarPorId(idCarrera);
};

module.exports = {
    buscarPorNombre,
    listarTodos,
    buscarPorId,
    crear,
    borrar,
    modificar
};

