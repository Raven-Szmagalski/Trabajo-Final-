
// Conexion Materia
const conexionBD = require('./conexionBD');

// Busqueda por nombre
const buscarPorNombre = async (nombre) => {
    try {
        const consulta = `SELECT idMateria, horasSemanales, nombre, tipoMateria,
        (CASE
            WHEN tipoMateria = 0 THEN 'cuatrimestral'
            WHEN tipoMateria = 1 THEN 'anual'
            ELSE ''
        END) AS tipoMateria
        FROM materia 
        WHERE activo = 1 AND nombre LIKE ?`;

        const [materia] = await conexionBD.query(consulta, [`%${nombre}%`]);
        return materia;

    } catch (error) {
        throw error;
    }
};

// Buscar todas las materias
const buscarTodos = async () => {
    
    try {

        const consulta = `SELECT idMateria, horasSemanales, nombre, tipoMateria,
        (CASE
            WHEN tipoMateria = 0 THEN 'cuatrimestral'
            WHEN tipoMateria = 1 THEN 'anual'
            ELSE ''
        END) AS tipoMateria
        FROM materia 
        WHERE activo = 1`;

        const [materia] = await conexionBD.query(consulta);    

        return materia;
    } catch (error) {
        throw error;
    }
};

// Busqueda por ID 
const buscarPorId = async (idMateria) => {

    const consulta = `SELECT idMateria, horasSemanales, nombre, tipoMateria,
    (CASE
        WHEN tipoMateria = 0 THEN 'cuatrimestral'
        WHEN tipoMateria = 1 THEN 'anual'
        ELSE ''
    END) AS tipoMateria
    FROM materia 
    WHERE activo = 1 AND idmateria = ?`;

    const [materia] = await conexionBD.query(consulta,idMateria);    

    return materia;

};

// Crear una materia
const crear = async (materia) => {
    try {
        const consulta = `
          INSERT INTO materia (nombre, tipoMateria, horasSemanales)
          VALUES (?, ?, ?)
        `;

        const [materiaNuevo] = await conexionBD.query(consulta, [ 
            materia.nombre,
            materia.horasSemanales,
            materia.tipoMateria,
            materia.activo
        ]);

        return { id: materiaNuevo.insertId, ...materia };
    } catch (error) {
        throw error;
    }
};

// Eliminar una materia
const borrar = async (idMateria) => {
    const consulta = 'UPDATE materia SET activo = 0 WHERE idMateria = ?';
    try {
        console.log('ID de la materia a eliminar:', idMateria);
        await conexionBD.query(consulta, [idMateria]);
        console.log('Materia eliminada correctamente');
    } catch (error) {
        console.error('Error eliminanda la materia:', error);
        throw error;
    }
};

// Editar una materia
const modificar = async (datos, idMateria) => {
    const consulta = 'UPDATE materia SET nombre = ?, horasSemanales = ?, tipoMateria = ? WHERE idMateria = ?';
    
    await conexionBD.query(consulta, [datos.nombre, datos.horasSemanales, datos.tipoMateria, idMateria]);
    
    return buscarPorId(idMateria);
};

module.exports = {
    buscarPorNombre,
    buscarTodos,
    buscarPorId,
    crear,
    borrar,
    modificar
};
