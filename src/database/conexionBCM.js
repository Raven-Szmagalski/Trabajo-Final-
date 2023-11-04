
// Inscipcion Carrera-Materia
const conexionBD = require('./conexionBD');

// Quitar materia de una carrera
const eliminarPorId = async (idCarreraMateria) => {
  const consultaEliminar = `
    DELETE carreramateria
    FROM carreramateria
    JOIN materia ON carreramateria.idMateria = materia.idMateria
    JOIN carrera ON carreramateria.idCarrera = carrera.idCarrera
    WHERE carreramateria.idCarreraMateria = ?
  `;

  const [resultadoEliminar] = await conexionBD.query(consultaEliminar, [idCarreraMateria]);

  return resultadoEliminar;
};

// Agregar materia a una carrera
const verificarExistenciaRelacion = async (idCarrera, idMateria) => {
  const consulta = 'SELECT * FROM carreramateria WHERE idCarrera = ? AND idMateria = ?';
  const [result] = await conexionBD.query(consulta, [idCarrera, idMateria]);
  return result.length > 0;
};

const agregarMateriaACarrera = async (idCarrera, idMateria) => {
  const existeRelacion = await verificarExistenciaRelacion(idCarrera, idMateria);

  if (existeRelacion) {
    throw new Error('La materia ya está agregada a la carrera');
  }

  const consulta = `
    SELECT c.nombre as nombre_carrera, m.nombre as nombre_materia
    FROM carrera c, materia m
    WHERE c.idCarrera = ? AND c.activo = 1
    AND m.idMateria = ? AND m.activo = 1;
  `;

  const [resultado] = await conexionBD.query(consulta, [idCarrera, idMateria]);

  if (resultado.length === 0) {
    throw new Error('La carrera o la materia no está activa o no existe');
  }

  const consultaAgregar = 'INSERT INTO carreramateria (idCarrera, idMateria, activo) VALUES (?, ?, 1)';
  const [result] = await conexionBD.query(consultaAgregar, [idCarrera, idMateria]);

  return { Carrera: resultado[0].nombre_carrera, Materia: resultado[0].nombre_materia, result };
};

// Listar las materias por el idCarrera
const obtenerInfo = async (idCarrera) => {
  const consulta = `
    SELECT c.nombre as nombre_carrera, m.nombre as nombre_materia
    FROM carreramateria cm
    JOIN materia m ON cm.idMateria = m.idMateria
    JOIN carrera c ON cm.idCarrera = c.idCarrera
    WHERE cm.idCarrera = ?;
  `;
  const [result] = await conexionBD.query(consulta, [idCarrera]);
  return result;
};

// Listar todo
const buscar = async () => {
  const consulta = `
    SELECT c.nombre as carrera, GROUP_CONCAT(m.nombre SEPARATOR ', ') as materias
    FROM carreramateria cm
    JOIN carrera c ON cm.idCarrera = c.idCarrera
    JOIN materia m ON cm.idMateria = m.idMateria
    GROUP BY c.nombre;
  `;

  const [result] = await conexionBD.query(consulta);
  return result;
};

module.exports = { 
  eliminarPorId, 
  obtenerInfo, 
  agregarMateriaACarrera, 
  buscar 
};
