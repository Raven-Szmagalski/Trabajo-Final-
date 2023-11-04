
// Estudiantes
const estConexion = require('../database/conexionBE');

// Hace una búsqueda por parámetros == nombre, apellido, DNI
const busqueda = async (req, res) => {
  try {
    const params = req.query.paramsBusqueda;

    const estudiantes = await estConexion.busqueda(params);

    if (estudiantes.length === 0) {
      res.status(404).json({ estado: 'FALLO', msj: 'No se encontró el estudiante' });
    } else {
      res.status(200).json({ estado: 'OK', estudiantes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ estado: 'ERROR', msj: 'Hubo un problema en el servidor' });
  }
};

// Busca todos los estudiantes 
const buscarTodos = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const estudiantes = await estConexion.buscarTodos();

      const results = estudiantes.slice(startIndex, endIndex);

      res.json({
          estado: 'OK',
          dato: results,
          currentPage: page,
          totalPages: Math.ceil(estudiantes.length / limit)
      });
  } catch (error) {
      console.error('Error al buscar todos los estudiantes:', error);
      res.status(500).json({ estado: 'FALLO', mensaje: 'Error interno del servidor al buscar los estudiantes', error: error.message });
  }
};

// Buscar por ID
const buscarPorId = async (req, res) => {
  try {
    const idEstudiante = req.params.idEstudiante;

    if (!idEstudiante) {
      res.status(404).json({ estado: 'FALLO', msj: 'Falta el id' });
    }

    const estudiante = await estConexion.buscarPorId(idEstudiante);

    res.json({ estado: 'OK', dato: estudiante });
  } catch (exec) {
    throw exec;
  }
};

// Agregar un estudiante
const nuevo = async (req, res) => {
  const { dni, nombre, apellido, fechaNacimiento, nacionalidad, correoElectronico, celular } = req.body;
  const file = req.file;
  const foto = file ? file.filename : null;

  if (!dni || !nombre || !apellido || !nacionalidad || !correoElectronico) {
    return res.status(400).json({
      estado: 'FALLO',
      mensaje: 'Campos obligatorios faltantes',
      errores: {
        dni: !dni ? 'El campo "dni" es obligatorio.' : null,
        nombre: !nombre ? 'El campo "nombre" es obligatorio.' : null,
        apellido: !apellido ? 'El campo "apellido" es obligatorio.' : null,
        nacionalidad: !nacionalidad ? 'El campo "nacionalidad" es obligatorio.' : null,
        correoElectronico: !correoElectronico ? 'El campo "correoElectronico" es obligatorio.' : null,
        celular: !celular ? 'El campo "celular" es obligatorio.' : null,
      },
    });
  } else {
    try {
      const estudiantesExistentes = await estConexion.busqueda(correoElectronico);
      if (estudiantesExistentes.length > 0) {
        return res.status(400).json({ estado: 'FALLO', mensaje: 'No se puede agregar el estudiante. Ya existe un estudiante con el mismo correo electrónico.' });
      }

      const estudiante = {
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        fechaNacimiento: fechaNacimiento,
        nacionalidad: nacionalidad,
        correoElectronico: correoElectronico,
        celular: celular,
        foto: foto
      };

      const estudianteNuevo = await estConexion.crear(estudiante);
      res.status(201).json({ estado: 'OK', msj: 'Estudiante creado', dato: estudianteNuevo });
    } catch (error) {
      throw error;
    }
  }
};

// Eliminar un estudiante
const eliminar = async (req, res) => {
  const idEstudiante = req.params.idEstudiante;

  if (!idEstudiante) {
    return res.status(404).json({ estado: 'FALLO', msj: 'No se especificó el ID del estudiante' });
  } else {
    try {
      await estConexion.borrar(idEstudiante);
      res.status(200).json({ estado: 'OK', msj: 'Estudiante eliminado' });
    } catch (error) {
      console.error('Error eliminando el estudiante:', error);
      res.status(500).json({ estado: 'FALLO', msj: 'Ocurrió un error al eliminar el estudiante' });
    }
  }
};

// Editar un estudiante
const modificarEstudiante = async (req, res) => {
  const { idEstudiante } = req.params;
  const { dni, nombre, apellido, fechaNacimiento, correoElectronico, celular, nacionalidad } = req.body;
  const file = req.file; 

  if (!idEstudiante) {
    return res.status(400).json({ estado: 'FALLO', mensaje: 'Se requiere proporcionar un ID de estudiante válido' });
  }

  const estudianteExistente = await estConexion.buscarPorId(idEstudiante);
  if (!estudianteExistente) {
    return res.status(404).json({ estado: 'FALLO', mensaje: 'El estudiante con el ID proporcionado no existe' });
  }

  try {
    if (correoElectronico && correoElectronico !== estudianteExistente.correoElectronico) {
      const estudiantesExistentes = await estConexion.busqueda(correoElectronico);
      if (estudiantesExistentes.length > 0) {
        return res.status(400).json({ estado: 'FALLO', mensaje: 'No se puede modificar el estudiante. Ya existe un estudiante con el mismo correo electrónico.' });
      }
    }

    const datosActualizados = {
      dni: dni || estudianteExistente.dni,
      nombre: nombre || estudianteExistente.nombre,
      apellido: apellido || estudianteExistente.apellido,
      fechaNacimiento: fechaNacimiento || estudianteExistente.fechaNacimiento,
      correoElectronico: correoElectronico || estudianteExistente.correoElectronico,
      celular: celular || estudianteExistente.celular,
      foto: file ? file.filename : estudianteExistente.foto, 
      nacionalidad: nacionalidad || estudianteExistente.nacionalidad
    };

    await estConexion.modificar(datosActualizados, idEstudiante);
    const estudianteModificado = await estConexion.buscarPorId(idEstudiante); 

    const cambiosRealizados = Object.keys(datosActualizados).filter(key => datosActualizados[key] !== estudianteExistente[key]);

    res.status(200).json({
      estado: 'ÉXITO',
      mensaje: `Se modificó el/los dato(s) ${cambiosRealizados.join(', ')} del estudiante`,
      datos: estudianteModificado
    });

  }catch (error) {
    res.status(500).json({ estado: 'FALLO', mensaje: 'Error interno del servidor', error: error.message });
  }
};

module.exports = {
  busqueda,
  buscarTodos,
  buscarPorId,
  nuevo,
  eliminar,
  modificarEstudiante
};


