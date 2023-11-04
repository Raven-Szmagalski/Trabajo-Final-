const { Router } = require('express');
const { check } = require('express-validator');
const {quitar, listar, agregar, listarTodo} = require('../../controllers/carreraMateriaController');
const { validarCampos } = require('../../middlewares/validarCampos');
const router = Router();

// Buscar por id 
router.get('/carrreramateria/:idCarrera', listar); //✓

// Listar todo
router.get('/carreramateria', listarTodo); //✓

// Agregar
router.post('/carreramateria', [
    check('idMateria')
        .notEmpty()
        .withMessage('El campo "idMateria" es obligatorio'),
    check('idCarrera')
        .notEmpty()
        .withMessage('El campo "idCarrera" es obligatorio'),
    validarCampos
], agregar); //✓

// Eliminar
router.delete('/carreramateria/:idCarreraMateria', [
    check('idCarreraMateria')
        .notEmpty()
        .withMessage('El campo "idCarreraMateria" es obligatorio'),
    validarCampos
], quitar); //✓ 

module.exports = router;
