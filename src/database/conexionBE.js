
// Conexion Estudiantes
const conexionBD = require('./conexionBD');

// Buscar por parametros: nombre, apellido y DNI
const busqueda = async(parametros) =>{
    const consulta = `SELECT  idEstudiante, dni, nombre, apellido, DATE_FORMAT(fechaNacimiento, '%Y-%m-%d') as fechaNacimientoFormateada, correoElectronico, celular, foto, 
        (CASE
            WHEN nacionalidad = 0 THEN 'argentino'
            WHEN nacionalidad = 1 THEN 'uruguayo'
            WHEN nacionalidad = 2 THEN 'chileno'
            WHEN nacionalidad = 3 THEN 'paraguayo'
            WHEN nacionalidad = 4 THEN 'brasilero'
            WHEN nacionalidad = 5 THEN 'boliviano'
            ELSE ''
        END) AS nacionalidad 
        FROM estudiante WHERE activo = 1 AND (nombre LIKE ? OR apellido LIKE ? OR dni LIKE ? )`;
    const params = [];
    params.push(`%${parametros}%`,`%${parametros}%`,`%${parametros}%`);
    const [estudiantes] = await conexionBD.query(consulta, params);
    return estudiantes;
};

// Buscar todos
const buscarTodos = async () => {
    try {
        const consulta = `SELECT  idEstudiante, dni, nombre, apellido, DATE_FORMAT(fechaNacimiento, '%Y-%m-%d') as fechaNacimiento, correoElectronico, celular, foto, 
        (CASE
            WHEN nacionalidad = 0 THEN 'argentino'
            WHEN nacionalidad = 1 THEN 'uruguayo'
            WHEN nacionalidad = 2 THEN 'chileno'
            WHEN nacionalidad = 3 THEN 'paraguayo'
            WHEN nacionalidad = 4 THEN 'brasilero'
            WHEN nacionalidad = 5 THEN 'boliviano'
            ELSE ''
        END) AS nacionalidad
        FROM estudiante 
        WHERE activo = 1`;

        const [estudiantes] = await conexionBD.query(consulta);
        return estudiantes;
    } catch (error) {
        throw error;
    }
};

// Busqueda por ID 
const buscarPorId = async (idEstudiante) => {

    const consulta = `SELECT  idEstudiante, dni, nombre, apellido, DATE_FORMAT(fechaNacimiento, '%Y-%m-%d') as fechaNacimiento, correoElectronico, celular, foto, 
    (CASE
        WHEN nacionalidad = 0 THEN 'argentino'
        WHEN nacionalidad = 1 THEN 'uruguayo'
        WHEN nacionalidad = 2 THEN 'chileno'
        WHEN nacionalidad = 3 THEN 'paraguayo'
        WHEN nacionalidad = 4 THEN 'brasilero'
        WHEN nacionalidad = 5 THEN 'boliviano'
        ELSE ''
    END) AS nacionalidad
    FROM estudiante 
    WHERE activo = 1 AND idEstudiante = ?`;

    const [estudiante] = await conexionBD.query(consulta,idEstudiante);    

    return estudiante;

};

// Crear un estudiante
const crear = async (estudiante) => {
    try {
        const consulta = "INSERT INTO estudiante SET ?";
        const [estudianteNuevo] = await conexionBD.query(consulta, [estudiante]);

        return buscarPorId(estudianteNuevo.insertId);
    } catch (error) {
        throw error;
    }
};


// Elimina un estudiante
const borrar = async (idEstudiante) => {
    const consulta = 'UPDATE estudiante SET activo = 0 WHERE idEstudiante = ?';
    try {
        console.log('ID de estudiante a eliminar:', idEstudiante);
        await conexionBD.query(consulta, [idEstudiante]);
        console.log('Estudiante eliminado correctamente');
    } catch (error) {
        console.error('Error eliminando el estudiante:', error);
        throw error;
    }
};

// Editar un estudiante
const modificar = async (dato, idEstudiante) => {
    const { dni, nombre, apellido, fechaNacimiento, correoElectronico, celular, foto, nacionalidad } = dato;
    const consulta = 'UPDATE estudiante SET dni = COALESCE(?, dni), nombre = COALESCE(?, nombre), apellido = COALESCE(?, apellido), fechaNacimiento = COALESCE(?, fechaNacimiento), correoElectronico = COALESCE(?, correoElectronico), celular = COALESCE(?, celular), foto = COALESCE(?, foto), nacionalidad = COALESCE(?, nacionalidad) WHERE idEstudiante = ?';
    
    await conexionBD.query(consulta, [dni, nombre, apellido, fechaNacimiento, correoElectronico, celular, foto, nacionalidad, idEstudiante]);
    
    return buscarPorId(idEstudiante);
};

module.exports = {
    busqueda,
    buscarTodos,
    buscarPorId,
    crear,
    borrar, 
    modificar
};