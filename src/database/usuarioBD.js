
// Conexion Usuarios
const conexion = require('./conexionBD');

const buscar = async (correoElectronico, clave) => {
    const consulta = `SELECT idUsuario, nombre, apellido, tipoUsuario, correoElectronico 
        FROM usuario WHERE correoElectronico = ? AND clave = SHA2(?, 256) AND activo = 1`;

    const [usuario] = await conexion.query(consulta, [correoElectronico, clave]);


    return usuario[0];
};

// Busqueda por ID
const buscarPorId = async (idUsuario) => {

    const consulta = 'SELECT idUsuario, tipoUsuario, nombre, apellido, correoElectronico FROM usuario WHERE idUsuario = ? AND activo = 1';
    
    const [usuario] = await conexion.query(consulta, `${idUsuario}`);

    return usuario;
}

module.exports = {
    buscarPorId,
    buscar
}
