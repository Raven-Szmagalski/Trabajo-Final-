
// Materias
const matConexion = require('../database/conexionBM');

// Buscar por nombre
const buscarPorNombre = async (req, res) => {
  try {
      const nombre = req.params.nombre;
      if (!nombre) {
          return res.status(400).json({ estado: 'FALLO', mensaje: 'Falta el parámetro de nombre' });
      }

      const materias = await matConexion.buscarPorNombre(nombre);
      res.json({ estado: 'OK', dato: materias });

  } catch (error) {
      console.error('Error buscando materias por nombre:', error);
      res.status(500).json({ estado: 'ERROR', mensaje: 'No se pudo realizar la búsqueda', error: error.message });
  }
};

// Buscar todas las materias 
const listarTodos = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const materia = await matConexion.buscarTodos();

      const results = materia.slice(startIndex, endIndex);

      res.json({
          estado: 'OK',
          dato: results,
          currentPage: page,
          totalPages: Math.ceil(materia.length / limit)
      });
  } catch (error) {
      console.error('Error al buscar todos los materia:', error);
      res.status(500).json({ estado: 'FALLO', mensaje: 'Error interno del servidor al buscar los materia', error: error.message });
  }
};

// Buscar por ID
const buscarPorId = async(req, res) => {
  try{
      const idMateria = req.params.idMateria;   
      
      if(!idMateria) {
          res.status(404).json({estado:'FALLO', msj:'Falta el id'});
      }

      const materia = await matConexion.buscarPorId(idMateria);

      res.json({estado:'OK', dato: materia});
  }catch (exec){
      throw exec;
  }
};

// Añadir una nueva materia
const crear = async (req, res) => {
  const { nombre, horasSemanales, tipoMateria} = req.body;

  if ( !nombre || !horasSemanales|| !tipoMateria) {
    return res.status(400).json({
      estado: 'FALLO',
      mensaje: 'Campos obligatorios faltantes',
      errores: {
        nombre: !nombre ? 'El campo "Nombre" es obligatorio.' : null,
        horasSemanales: !horasSemanales ? 'El campo "Horas semanales" es obligatorio.' : null,
        tipoMateria: !tipoMateria ? 'El campo "Tipo Materia" es obligatorio.' : null,
      },
    });
  }

  try {
      const resultadoInsercion = await matConexion.crear({
        nombre, horasSemanales, tipoMateria, activo: 1
      });

    res.status(201).json({ estado: 'OK', mensaje: 'La materia fue insertada con éxito', nuevoMateria: resultadoInsercion });
  } catch (error) {
    res.status(500).json({ estado: 'ERROR', mensaje: 'No se pudo insertar la materia', error: error.message });
  }
};

// Eliminar una materia
const eliminar = async (req, res) => {
  const idMateria = req.params.idMateria;

  if (!idMateria) {
    res.status(404).json({ estado: 'FALLO', msj: 'no se especifico el id de la materia' });
  } else {
    try {
      await matConexion.borrar(idMateria);
      res.status(200).json({ estado: 'OK', msj: 'Materia eliminada' });
    } catch (error) {
      console.error('Error al eliminar la materia:', error);
      res.status(500).json({ estado: 'FALLO', msj: 'Ocurrió un error al eliminar la materia' });
    }
  }
};

// Modificar una materia
const modificarMateria = async (req, res) => {
  try {
      const { idMateria } = req.params;
      const { nombre, horasSemanales, tipoMateria } = req.body;

      if (!idMateria) {
          return res.status(400).json({ estado: 'FALLO', mensaje: 'Se requiere proporcionar un ID de materia válido' });
      } 

      const materiaExistente = await matConexion.buscarPorId(idMateria);
      if (!materiaExistente) {
          return res.status(404).json({ estado: 'FALLO', mensaje: 'La materia con el ID proporcionado no existe' });
      }

      const datosActualizados = {
          nombre: nombre !== '' ? nombre : materiaExistente.nombre,
          horasSemanales: horasSemanales !== '' ? horasSemanales : materiaExistente.horasSemanales,
          tipoMateria: tipoMateria !== '' ? tipoMateria : materiaExistente.tipoMateria,
      };

      const materiaModificada = await matConexion.modificar(datosActualizados, idMateria);

      res.status(200).json({ estado: 'ÉXITO', mensaje: 'Materia modificada con éxito', datos: materiaModificada });
  } catch (error) {
      res.status(500).json({ estado: 'FALLO', mensaje: 'Error interno del servidor', error: error.message });
  }
};

module.exports = { 
  buscarPorNombre, 
  listarTodos, 
  buscarPorId, 
  crear, 
  eliminar, 
  modificarMateria 
};
