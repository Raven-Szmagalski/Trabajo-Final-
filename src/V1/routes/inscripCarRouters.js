const { Router } = require('express');
const { check } = require('express-validator');
const { buscarPorId, buscarTodas, nuevaInscripcion, eliminarInscripcion, modificarInscripcion, buscarPorNombre } = require('../../controllers/inscripCarController');
const { validarCampos } = require('../../middlewares/validarCampos');
const router = Router();

// Buscar por ID
router.get('/estudiantecarrera/:idEstudianteCarrera', buscarPorId); //✓ 

// Buscar todas
router.get('/estudiantecarrera', buscarTodas); //✓ 

// Buscar por nombre
router.get('/estudiantecarrera/buscar/:nombre', buscarPorNombre); //✓

// Agregar
router.post('/estudiantecarrera', [
    check('carrera')
        .notEmpty()
        .withMessage('El campo "carrera" es obligatorio'),
    check('estudiante')
        .notEmpty()
        .withMessage('El campo "estudiante" es obligatorio'),
    validarCampos
], nuevaInscripcion); //✓ 

// Eliminar
router.delete('/estudiantecarrera/:idEstudianteCarrera', [
    check('idEstudianteCarrera')
        .notEmpty()
        .withMessage('El campo "idEstudianteCarrera" es obligatorio'),
    validarCampos
], eliminarInscripcion); //✓

// Editar
router.put('/estudiantecarrera/:idEstudianteCarrera', modificarInscripcion); //✓ 

module.exports = router;

