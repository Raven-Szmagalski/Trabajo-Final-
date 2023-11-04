
// Inscipciones Carreras
const inscripcionBD = require('../database/conexionBIC');

// Buscar las inscripciones de las carreras por ID
const buscarPorId = async (req, res) => {
    try {
      const idInscripcion = req.params.idEstudianteCarrera;
  
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

// Buscar todas las inscripciones de las carreras
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
  
        const carrera = await inscripcionBD.buscarPorNombre(nombre);
        res.json({ estado: 'OK', dato: carrera });
  
    } catch (error) {
        console.error('Error buscando la carrera por nombre:', error);
        res.status(500).json({ estado: 'ERROR', mensaje: 'No se pudo realizar la búsqueda', error: error.message });
    }
};


// Nueva inscripcion de una carrera
const nuevaInscripcion = async (req, res) => {
    const { estudiante, carrera } = req.body;

    if (!estudiante || !carrera) {
        res.status(404).json({ estado: 'FALLO', msj: 'Faltan datos requeridos' });
    } else {
        try {
            const estudianteActivo = await inscripcionBD.verificarEstudianteActivo(estudiante);
            if (!estudianteActivo) {
                res.status(404).json({ estado: 'FALLO', msj: 'Estudiante inactivo. No se puede realizar la inscripción.' });
            } else {
                const inscripcion = {
                    estudiante: estudiante,
                    carrera: carrera
                };

                const nuevaInscripcion = await inscripcionBD.nuevaInscripcion(inscripcion);
                res.status(201).json({ estado: 'OK', msj: 'Inscripción creada', dato: nuevaInscripcion });
            }
        } catch (error) {
            throw error;
        }
    }
};

// Cancelar la inscripción de un estudiante en una carrera específica
const eliminarInscripcion = async (req, res) => {
    const idInscripcion = req.params.idEstudianteCarrera;

    if (!idInscripcion) {
        res.status(404).json({ estado: 'FALLO', msj: 'No se especificó el ID de la inscripción' });
    } else {
        try {
            const inscripcionEliminada = await inscripcionBD.cancelarInscripcion(idInscripcion);
            res.status(200).json({ estado: 'OK', msj: 'Inscripción dada de baja correctamente', inscripcion: inscripcionEliminada });
        } catch (error) {
            console.error('Error eliminando la inscripción:', error);
            res.status(500).json({ estado: 'FALLO', msj: 'Ocurrió un error al eliminar la inscripción' });
        }
    }
};

// Actualizar una inscripcion
const modificarInscripcion = async (req, res) => {
    try {
        const { idEstudianteCarrera } = req.params;
        const { estudiante, carrera } = req.body;

        if (!idEstudianteCarrera) {
            return res.status(400).json({ estado: 'FALLO', mensaje: 'Se requiere proporcionar un ID de inscripción válido' });
        }

        const inscripcionExistente = await inscripcionBD.listarPorId(idEstudianteCarrera);
        if (!inscripcionExistente) {
            return res.status(404).json({ estado: 'FALLO', mensaje: 'La inscripción con el ID proporcionado no existe' });
        }

        const datosActualizados = {
            estudiante: estudiante || inscripcionExistente.estudiante,
            carrera: carrera || inscripcionExistente.carrera
        };

        await inscripcionBD.actualizarInscripcion(datosActualizados, idEstudianteCarrera);

        const inscripcionActualizada = await inscripcionBD.listarPorId(idEstudianteCarrera);

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
