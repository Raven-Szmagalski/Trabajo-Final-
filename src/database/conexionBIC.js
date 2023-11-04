
// Inscripciones Carreras
const conexionBD = require('./conexionBD');

// Buscar las inscripciones de las carreras por ID
const listarPorId = async (idInscripcion) => {
    try {
        const consulta = `SELECT ic.idEstudianteCarrera, e.nombre AS estudiante, c.nombre AS carrera, DATE_FORMAT(ic.fechaAlta, '%Y-%m-%d') AS fechaAlta, DATE_FORMAT(ic.fechaBaja, '%Y-%m-%d') AS fechaBaja
                        FROM estudiantecarrera ic
                        JOIN estudiante e ON ic.estudiante = e.idEstudiante
                        JOIN carrera c ON ic.carrera = c.idCarrera
                        WHERE ic.idEstudianteCarrera = ?`;

        const [inscripcion] = await conexionBD.query(consulta, idInscripcion);

        return inscripcion;
    } catch (error) {
        throw error;
    }
};

// Buscar todas las inscripciones de las carreras
const listarTodas = async () => {
    try {
        const consulta = `SELECT ic.idEstudianteCarrera, e.nombre AS estudiante, c.nombre AS carrera, DATE_FORMAT(ic.fechaAlta, '%Y-%m-%d') AS fechaAlta, DATE_FORMAT(ic.fechaBaja, '%Y-%m-%d') AS fechaBaja
                          FROM estudiantecarrera ic
                          JOIN estudiante e ON ic.estudiante = e.idEstudiante
                          JOIN carrera c ON ic.carrera = c.idCarrera`;
        const [inscripciones] = await conexionBD.query(consulta);
        return inscripciones;
    } catch (error) {
        throw error;
    }
};

// Buscar por nombre
const buscarPorNombre = async (nombre) => {
    try {
        const consulta = `SELECT ic.idEstudianteCarrera, e.nombre AS estudiante, c.nombre AS carrera, DATE_FORMAT(ic.fechaAlta, '%Y-%m-%d') AS fechaAlta, DATE_FORMAT(ic.fechaBaja, '%Y-%m-%d') AS fechaBaja
                        FROM estudiantecarrera ic
                        JOIN estudiante e ON ic.estudiante = e.idEstudiante
                        JOIN carrera c ON ic.carrera = c.idCarrera
                        WHERE c.nombre = ?`;

        const [carrera] = await conexionBD.query(consulta, [nombre]);
        return carrera;

    } catch (error) {
        throw error;
    }
};


// Verifica si el estudiante esta activo
const verificarEstudianteActivo = async (estudiante) => {
    try {
        const consulta = 'SELECT * FROM estudiante WHERE idEstudiante = ? AND activo = true'; 
        const [estudianteActivo] = await conexionBD.query(consulta, [estudiante]);
        return estudianteActivo.length > 0; 
    } catch (error) {
        throw error;
    }
};

// Nueva inscripcion de una carrera
const nuevaInscripcion = async (inscripcion) => {
    try {
        const fechaActual = new Date().toISOString().slice(0, 10);
        const nuevaInscripcionData = { ...inscripcion, fechaAlta: fechaActual };
        const consulta = 'INSERT INTO estudiantecarrera SET ?';
        const [nuevaInscripcion] = await conexionBD.query(consulta, nuevaInscripcionData);
        const idNuevaInscripcion = nuevaInscripcion.insertId;
        return listarPorId(idNuevaInscripcion);
    } catch (error) {
        throw error;
    }
};

// Cancelar una inscripcion en una carrera
const cancelarInscripcion = async (idInscripcion) => {
    const consulta = `SELECT ic.idEstudianteCarrera, e.nombre AS estudiante, c.nombre AS carrera, DATE_FORMAT(ic.fechaAlta, '%Y-%m-%d') AS fechaAlta, DATE_FORMAT(ic.fechaBaja, '%Y-%m-%d') AS fechaBaja
                          FROM estudiantecarrera ic
                          JOIN estudiante e ON ic.estudiante = e.idEstudiante
                          JOIN carrera c ON ic.carrera = c.idCarrera
                          WHERE ic.idEstudianteCarrera = ?`;
    const Actualizacion = 'UPDATE estudiantecarrera SET fechaBaja = CURDATE() WHERE idEstudianteCarrera = ?';

    try {
        await conexionBD.query(Actualizacion, [idInscripcion]);
        const [inscripcion] = await conexionBD.query(consulta, [idInscripcion]);
        const inscripcionCancelada = inscripcion[0];
        console.log('Inscripción cancelada:', inscripcionCancelada);
        console.log('Inscripción dada de baja correctamente');
        return inscripcionCancelada;
    } catch (error) {
        console.error('Error dando de baja la inscripción:', error);
        throw error;
    }
};


// Actualizar una inscripcion
const actualizarInscripcion = async (datosActualizados, idInscripcion) => {
    const consulta = 'UPDATE estudiantecarrera SET ? WHERE idEstudianteCarrera = ?';
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
