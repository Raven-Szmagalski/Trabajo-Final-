
// Carreras
const carConexion = require('../database/conexionBC');

// Buscar por nombre
const buscarPorNombre = async (req, res) => {
    try {
        const nombre = req.params.nombre;
        if (!nombre) {
            return res.status(400).json({ estado: 'FALLO', mensaje: 'Falta el parámetro de nombre' });
        }

        const carreras = await carConexion.buscarPorNombre(nombre);
        res.json({ estado: 'OK', dato: carreras });

    } catch (error) {
        console.error('Error buscando carreras por nombre:', error);
        res.status(500).json({ estado: 'ERROR', mensaje: 'No se pudo realizar la búsqueda', error: error.message });
    }
};

// Buscar todas las carreras
const buscarTodos = async (req, res) => {
    try {
        const carrera = await carConexion.listarTodos();

        res.json({ estado: 'OK', dato: carrera });

    } catch (exec) {
        throw exec;
    }
};

// Buscar por ID
const buscarPorId = async (req, res) => {
    try {
        const idCarrera = req.params.idCarrera;

        if (!idCarrera) {
            res.status(404).json({ estado: 'FALLO', msj: 'Falta el id' });
        }

        const carrera = await carConexion.buscarPorId(idCarrera);

        res.json({estado: 'OK', dato:carrera});
    } catch (exec) {
        throw exec;
    }
};

// Agregar una carrera
const crear = async (req, res) => {
    const {nombre, modalidad} = req.body;
  
    if ( !nombre || !modalidad) {
      return res.status(400).json({
        estado: 'FALLO',
        mensaje: 'Campos obligatorios faltantes',
        errores: {
          nombre: !nombre ? 'El campo "nombre" es obligatorio.' : null,
          modalidad: !modalidad ? 'El campo "modalidad" es obligatorio.' : null,
        },
      });
    }
  
    try {
        const resultadoInsercion = await carConexion.crear({
            nombre, modalidad, activo: 1
        });
  
      res.status(201).json({ estado: 'OK', mensaje: 'La carrera fue insertada con éxito', nuevaCarrera: resultadoInsercion });
    } catch (error) {
      res.status(500).json({ estado: 'ERROR', mensaje: 'No se pudo insertar la carrera', error: error.message });
    }
};
  
// Elimina una carrera
const eliminar = async (req, res) => {
    const idCarrera = req.params.idCarrera;
  
    if (!idCarrera) {
      res.status(404).json({ estado: 'FALLO', msj: 'no se especifico el id de la carrera' });
    } else {
      try {
        await carConexion.borrar(idCarrera);
        res.status(200).json({ estado: 'OK', msj: 'Carrera eliminada' });
      } catch (error) {
        console.error('Error al eliminar la carrera:', error);
        res.status(500).json({ estado: 'FALLO', msj: 'Ocurrió un error al eliminar la carrera' });
      }
    }
};


// Modificar una materia
const modificarCarrera = async (req, res) => {
    try {
        const { idCarrera } = req.params;
        const { nombre, modalidad } = req.body;
  
        if (!idCarrera) {
            return res.status(400).json({ estado: 'FALLO', mensaje: 'Se requiere proporcionar un ID de carrera válido' });
        } 
  
        const carreraExistente = await carConexion.buscarPorId(idCarrera);
        if (!carreraExistente) {
            return res.status(404).json({ estado: 'FALLO', mensaje: 'La carrera con el ID proporcionado no existe' });
        }
  
        const datosActualizados = {
            nombre: nombre !== '' ? nombre : carreraExistente.nombre,
            modalidad: modalidad !== undefined ? modalidad : carreraExistente.modalidad,
        }
        const carreraModificada = await carConexion.modificar(datosActualizados, idCarrera);
  
        res.status(200).json({ estado: 'ÉXITO', mensaje: 'Carrera modificada con éxito', datos: carreraModificada });
    } catch (error) {
        res.status(500).json({ estado: 'FALLO', mensaje: 'Error interno del servidor', error: error.message });
    }
};

module.exports = {
    buscarPorNombre,
    buscarTodos,
    buscarPorId,
    crear,
    eliminar,
    modificarCarrera
};
  