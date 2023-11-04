
// Inscripciones Materia
const conexionBD = require('./conexionBD');

// Buscar las inscripciones de las materias por ID
const listarPorId = async (idInscripcion) => {
    const consulta = `SELECT im.idEstudianteMateria, DATE_FORMAT(im.fecha, '%Y-%m-%d') AS fecha, e.nombre AS estudiante, m.nombre AS materia
                      FROM estudiantemateria im
                      JOIN estudiante e ON im.estudiante = e.idEstudiante
                      JOIN materia m ON im.materia = m.idMateria
                      WHERE im.idEstudianteMateria = ?`;

    const [inscripcion] = await conexionBD.query(consulta, idInscripcion);

    return inscripcion;
};

// Buscar todas las inscripciones de las materias
const listarTodas = async () => {
    try {
        const consulta = `SELECT im.idEstudianteMateria, DATE_FORMAT(im.fecha, '%Y-%m-%d') AS fecha, e.nombre AS estudiante, m.nombre AS materia
                          FROM estudiantemateria im
                          JOIN estudiante e ON im.estudiante = e.idEstudiante
                          JOIN materia m ON im.materia = m.idMateria`;
        const [inscripciones] = await conexionBD.query(consulta);
        return inscripciones;
    } catch (error) {
        throw error;
    }
};

// Buscar por nombre
const buscarPorNombre = async (nombre) => {
    try {
        const consulta = `SELECT em.idEstudianteMateria, em.fecha, e.nombre AS estudiante, m.nombre AS materia
                        FROM estudiantemateria em
                        JOIN estudiante e ON em.estudiante = e.idEstudiante
                        JOIN materia m ON em.materia = m.idMateria
                        WHERE m.nombre = ?`;

        const [materia] = await conexionBD.query(consulta, [nombre]);
        return materia;

    } catch (error) {
        throw error;
    }
};

// Verificar si estudiante esta activo
const verificarEstudianteActivo = async (estudiante) => {
    try {
        const consulta = 'SELECT * FROM estudiante WHERE idEstudiante = ? AND activo = true'; 
        const [estudianteActivo] = await conexionBD.query(consulta, [estudiante]);
        return estudianteActivo.length > 0; 
    } catch (error) {
        throw error;
    }
};

// Nueva inscripcion de una materia
const nuevaInscripcion = async (inscripcion) => {
    try {
        const fechaActual = new Date().toISOString().slice(0, 10);
        const nuevaInscripcionData = { ...inscripcion, fecha: fechaActual };
        const consulta = 'INSERT INTO estudiantemateria SET ?';
        const [nuevaInscripcion] = await conexionBD.query(consulta, nuevaInscripcionData);
        const idNuevaInscripcion = nuevaInscripcion.insertId;
        return listarPorId(idNuevaInscripcion);
    } catch (error) {
        throw error;
    }
};

// Cancelar la inscripción de un estudiante en una materia específica
const cancelarInscripcion = async (idInscripcion) => {
    const consulta = 'DELETE FROM estudiantemateria WHERE idEstudianteMateria = ?';
    try {
        console.log('ID de inscripción a eliminar:', idInscripcion);
        await conexionBD.query(consulta, [idInscripcion]);
        console.log('Inscripción eliminada correctamente');
    } catch (error) {
        console.error('Error eliminando la inscripción:', error);
        throw error;
    }
};

// Actualizar una inscripcion
const actualizarInscripcion = async (datosActualizados, idInscripcion) => {
    const consulta = 'UPDATE estudiantemateria SET ? WHERE idEstudianteMateria = ?';
    try {
        await conexionBD.query(consulta, [datosActualizados, idInscripcion]);
        console.log('Inscripción modificada correctamente');
        return listarPorId(idInscripcion);
    } catch (error) {
        console.error('Error modificando la inscripción:', error);
        throw error;
    }
};


module.exports = {
    listarPorId,
    listarTodas,
    verificarEstudianteActivo,
    nuevaInscripcion,
    cancelarInscripcion,
    actualizarInscripcion,
    buscarPorNombre
};