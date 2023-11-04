const { Router } = require('express');
const { check } = require('express-validator');
const { enviarCorreo } = require('../../controllers/publico');
const { validarCampos } = require('../../middlewares/validarCampos');

const router = Router();

// Correo
router.post('/contacto', [
    check('correo').isEmail().withMessage('Por favor, introduce un correo electrónico válido'),
    check('nombre').trim().not().isEmpty().withMessage('Por favor, introduce tu nombre'),
    check('mensaje').trim().not().isEmpty().withMessage('Por favor, escribe un mensaje'),
    validarCampos
], enviarCorreo); //✓

module.exports = router; 
