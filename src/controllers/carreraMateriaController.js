
// Inscipcion Carrera-Materia
const carreraMateriaBD = require('../database/conexionBCM');

// Quitar materia de una carrera
const quitar = async (req, res) => {
  const { idCarreraMateria } = req.params; 

  try {
    const { idMateria, idCarrera } = await carreraMateriaBD.eliminarPorId(idCarreraMateria);
    res.status(200).json({ message: 'Se eliminó correctamente', materiaEliminada: idMateria, carreraEliminada: idCarrera });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la materia de la carrera', error: error.message });
  }
};

// Agregar materia a una carrera
const agregar = async (req, res) => {
  const { idCarrera, idMateria } = req.body;

  try {
    const { Carrera, Materia } = await carreraMateriaBD.agregarMateriaACarrera(idCarrera, idMateria);
    res.status(200).json({ message: 'Materia agregada a la carrera correctamente', Carrera, Materia });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar la materia a la carrera', error: error.message });
  }
};

// Listar las materias por el idCarrera
const listar = async (req, res) => {
  const { idCarrera } = req.params;

  try {
    const infoCarreraMaterias = await carreraMateriaBD.obtenerInfo(idCarrera);
    if (infoCarreraMaterias.length > 0) {
      const nombreCarrera = infoCarreraMaterias[0].nombre_carrera;
      const materias = infoCarreraMaterias.map((info) => info.nombre_materia);
      res.status(200).json({ carrera: nombreCarrera, materias: materias });
    } else {
      res.status(404).json({ message: 'No se encontraron materias para la carrera proporcionada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la información de la carrera y las materias', error: error.message });
  }
};

// Listar todo
const listarTodo = async (req, res) => {
  try {
    const data = await carreraMateriaBD.buscar();
    if (data.length > 0) {
      res.status(200).json({ message: 'Listado de todas las carreras y materias exitoso', data: data });
    } else {
      res.status(404).json({ message: 'No se encontraron datos de carreras y materias' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al listar todas las carreras y materias', error: error.message });
  }
};

module.exports = { 
  quitar, 
  listar, 
  agregar, 
  listarTodo 
};
