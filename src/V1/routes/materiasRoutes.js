const { Router } = require('express');
const { check } = require('express-validator');
const { buscarPorNombre, listarTodos, buscarPorId, crear, eliminar, modificarMateria } = require('../../controllers/materiasController');
const { validarCampos } = require('../../middlewares/validarCampos');
const router = Router();

// Buscar por ID
router.get('/materias/:idMateria', buscarPorId); //✓

// Listar todas las carreras
router.get('/materias', listarTodos); //✓

// Buscar por nombre
router.get('/materias/buscar/:nombre', buscarPorNombre); //✓

// Agregar
router.post(
  '/materias',
  [
    check('nombre').notEmpty().withMessage('El campo "nombre" es obligatorio'),
    check('horasSemanales').notEmpty().withMessage('El campo "horasSemanales" es obligatorio'),
    check('tipoMateria').isIn([0, 1]).withMessage('El campo "tipoMateria" debe ser 0 = cuatrimestral o 1 = anual'),
    validarCampos
  ],
  crear
); //✓

// Eliminar
router.delete('/materias/:idMateria', [
  check('idMateria')
      .notEmpty()
      .withMessage('El campo "idMateria" es obligatorio'),
  validarCampos
], eliminar); //✓

// Editar
router.put(
  '/materias/:idMateria',
  [
    check('tipoMateria').isIn([0, 1]).withMessage('El campo "tipoMateria" debe ser 0 = cuatrimestral o 1 = anual'),
    validarCampos
  ],
  modificarMateria
); //✓

module.exports = router;
