const { Router } = require('express');
const { check } = require('express-validator');
const { busqueda, buscarTodos, buscarPorId, nuevo, eliminar, modificarEstudiante } = require('../../controllers/estudiantesControllers');
const { upload } = require('../../controllers/subirArchivo');
const { validarCampos } = require('../../middlewares/validarCampos');

const router = Router();

// Busqueda por parametros
router.get('/estudiantes/buscar', busqueda); //✓ ---> http://localhost:3010/v1/api/estudiantes/buscar?paramsBusqueda=franchesca

// Listar todos los estudiantes
router.get('/estudiantes', buscarTodos); //✓

// Buscar por ID
router.get('/estudiantes/:idEstudiante', buscarPorId); //✓

// Agregar
router.post(
    '/estudiantes',
    upload,
    [
      check('dni')
        .isLength({ min: 8, max: 8 })
        .withMessage('El DNI debe tener 8 dígitos'),
      check('correoElectronico')
        .isEmail()
        .withMessage('El correo electrónico no tiene un formato válido'),
      check('nombre')
        .notEmpty()
        .withMessage('El campo "nombre" es obligatorio'),
      check('apellido')
        .notEmpty()
        .withMessage('El campo "apellido" es obligatorio'),
      check('nacionalidad')
        .notEmpty()
        .withMessage('El campo "nacionalidad" es obligatorio'),
      validarCampos,
    ],
    nuevo
); //✓

// Eliminar 
router.delete('/estudiantes/:idEstudiante', eliminar); //✓

// Editar
router.put(
    '/estudiantes/:idEstudiante',
    upload,
    [
        check('dni')
            .optional()
            .isLength({ min: 8, max: 8 })
            .withMessage('El DNI debe tener 8 dígitos'),
        check('correoElectronico')
            .optional()
            .isEmail()
            .withMessage('El correo electrónico no tiene un formato válido'),
        validarCampos,
    ],
    modificarEstudiante
); //✓

module.exports = router;

