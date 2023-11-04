
// Inscipciones Materias
const inscripcionBD = require('../database/conexionBIM');

// Buscar las inscripciones de las materias por ID
const buscarPorId = async (req, res) => {
    try {
      const idInscripcion = req.params.idEstudianteMateria;
  
      if (!idInscripcion) {
        res.status(404).json({ estado: 'FALLO', msj: 'Falta el id' });
      }
  
      const inscripcion = await inscripcionBD.listarPorId(idInscripcion);
  
      if (!inscripcion) {
        res.status(404).json({ estado: 'FALLO', msj: 'Inscripcion no encontrada' });
      } else {
        res.json({ estado: 'OK', dato: inscripcion });
      }
    } catch (error) {
      throw error;
    }
};

// Buscar todas las inscripciones 
const buscarTodas = async (req, res) => {
    try {
      const inscripciones = await inscripcionBD.listarTodas();
  
      res.json({ estado: 'OK', dato: inscripciones });
  
    } catch (error) {
      throw error;
    }
};

// Buscar por nombre
const buscarPorNombre = async (req, res) => {
    try {
        const nombre = req.params.nombre;
        if (!nombre) {
            return res.status(400).json({ estado: 'FALLO', mensaje: 'Falta el parámetro de nombre' });
        }
  
        const materia = await inscripcionBD.buscarPorNombre(nombre);
        res.json({ estado: 'OK', dato: materia });
  
    } catch (error) {
        console.error('Error buscando la materia por nombre:', error);
        res.status(500).json({ estado: 'ERROR', mensaje: 'No se pudo realizar la búsqueda', error: error.message });
    }
};

// Nueva inscripcion de una materia
const nuevaInscripcion = async (req, res) => {
    const { estudiante, materia } = req.body;

    if (!estudiante || !materia) {
        res.status(404).json({ estado: 'FALLO', msj: 'Faltan datos requeridos' });
    } else {
        try {
            const estudianteActivo = await inscripcionBD.verificarEstudianteActivo(estudiante);
            if (!estudianteActivo) {
                res.status(404).json({ estado: 'FALLO', msj: 'Estudiante inactivo. No se puede realizar la inscripción.' });
            } else {
                const inscripcion = {
                    estudiante: estudiante,
                    materia: materia
                };

                const nuevaInscripcion = await inscripcionBD.nuevaInscripcion(inscripcion);
                res.status(201).json({ estado: 'OK', msj: 'Inscripción creada', dato: nuevaInscripcion });
            }
        } catch (error) {
            throw error;
        }
    }
};

// Cancelar la inscripción de un estudiante en una materia 
const eliminarInscripcion = async (req, res) => {
    const idInscripcion = req.params.idEstudianteMateria;

    if (!idInscripcion) {
        res.status(404).json({ estado: 'FALLO', msj: 'No se especificó el ID de la inscripción' });
    } else {
        try {
            await inscripcionBD.cancelarInscripcion(idInscripcion);
            res.status(200).json({ estado: 'OK', msj: 'Inscripción eliminada' });
        } catch (error) {
            console.error('Error eliminando la inscripción:', error);
            res.status(500).json({ estado: 'FALLO', msj: 'Ocurrió un error al eliminar la inscripción' });
        }
    }
};

// Actualizar una inscripcion
const modificarInscripcion = async (req, res) => {
    try {
        const { idEstudianteMateria } = req.params;
        const { estudiante, materia } = req.body;

        if (!idEstudianteMateria) {
            return res.status(400).json({ estado: 'FALLO', mensaje: 'Se requiere proporcionar un ID de inscripción válido' });
        }

        const inscripcionExistente = await inscripcionBD.listarPorId(idEstudianteMateria);
        if (!inscripcionExistente) {
            return res.status(404).json({ estado: 'FALLO', mensaje: 'La inscripción con el ID proporcionado no existe' });
        }

        const datosActualizados = {
            estudiante: estudiante || inscripcionExistente.nombreEstudiante,
            materia: materia || inscripcionExistente.nombreMateria
        }

        await inscripcionBD.actualizarInscripcion(datosActualizados, idEstudianteMateria);

        const inscripcionActualizada = await inscripcionBD.listarPorId(idEstudianteMateria);

        res.status(200).json({ estado: 'ÉXITO', mensaje: 'Inscripción modificada con éxito', datos: inscripcionActualizada });
    } catch (error) {
        res.status(500).json({ estado: 'FALLO', mensaje: 'Error interno del servidor', error: error.message });
    }
};


module.exports = {
    buscarPorId,
    buscarTodas,
    nuevaInscripcion,
    eliminarInscripcion,
    modificarInscripcion,
    buscarPorNombre
};