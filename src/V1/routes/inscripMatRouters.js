const { Router } = require('express');
const { check } = require('express-validator');
const { buscarPorId, buscarTodas, nuevaInscripcion, eliminarInscripcion, modificarInscripcion, buscarPorNombre} = require('../../controllers/inscripMatController');
const { validarCampos } = require('../../middlewares/validarCampos');
const router = Router();

// Buscar por ID
router.get('/estudiantemateria/:idEstudianteMateria', buscarPorId); //✓ 

// Buscar todas
router.get('/estudiantemateria', buscarTodas); //✓ 

// Buscar por nombre
router.get('/estudiantemateria/buscar/:nombre', buscarPorNombre); //✓

// Agregar
router.post('/estudiantemateria', [
    check('materia')
        .notEmpty()
        .withMessage('El campo "materia" es obligatorio'),
    check('estudiante')
        .notEmpty()
        .withMessage('El campo "estudiante" es obligatorio'),
    validarCampos
], nuevaInscripcion); //✓ 

// Eliminar
router.delete('/estudiantemateria/:idEstudianteMateria', [
    check('idEstudianteMateria')
        .notEmpty()
        .withMessage('El campo "idEstudianteMateria" es obligatorio'),
    validarCampos
], eliminarInscripcion); //✓

// Editar
router.put('/estudiantemateria/:idEstudianteMateria', modificarInscripcion); //✓

module.exports = router;

