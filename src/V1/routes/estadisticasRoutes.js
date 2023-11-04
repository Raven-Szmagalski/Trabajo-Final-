const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerEstadistica } = require('../../controllers/estadisticaController');
const { validarCampos } = require('../../middlewares/validarCampos');

const router = Router();

// Buscar las estadisticas
router.get(
  '/estadisticas',
  [
    check('idMateria').isInt().withMessage('El ID de materia debe ser un número entero'),
    check('idCarrera').isInt().withMessage('El ID de carrera debe ser un número entero'),
    check('nacionalidad').isInt().withMessage('El valor de nacionalidad debe ser un número entero'),
    validarCampos,
  ],
  obtenerEstadistica
); //✓ ---> http://localhost:3010/v1/api/estadistica?idMateria=1&idCarrera=2&nacionalidad=0 

module.exports = router;
