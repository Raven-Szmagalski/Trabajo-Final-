const { Router } = require('express');
const { check } = require('express-validator');
const { buscarPorId, buscarTodos, buscarPorNombre, crear, eliminar, modificarCarrera } = require('../../controllers/carrerasController');
const { validarCampos } = require('../../middlewares/validarCampos')

const router = Router();

// Buscar por ID
router.get('/carreras/:idCarrera', buscarPorId); //✓

// Buscar todas las carreras
router.get('/carreras', buscarTodos); //✓

// Buscar por nombre
router.get('/carreras/buscar/:nombre', buscarPorNombre); //✓

// Agregar
router.post(
  '/carreras',
  [
    check('nombre').notEmpty().withMessage('El campo "nombre" es obligatorio'),
    check('modalidad').isIn([0, 1]).withMessage('El campo "modalidad" debe ser 0 = virtual o 1 = presencial'),
    validarCampos
  ],
  crear
); //✓

// Eliminar
router.delete('/carreras/:idCarrera', eliminar); //✓

// Modificar
router.put(
  '/carreras/:idCarrera',
  [
    check('modalidad').isIn([0, 1]).withMessage('El campo "modalidad" debe ser 0 = "virtual" o 1 = "presencial"'),
    validarCampos
  ],
  modificarCarrera
); //✓

module.exports = router;
