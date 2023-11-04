const { validationResult } = require("express-validator");

// Validaciones
const validarCampos = (req, res, next) => {

    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        return res.status(400).json({ estado: 'ERROR', msj: erros.mapped() })
    }

    next();
}

module.exports = {
    validarCampos,
}