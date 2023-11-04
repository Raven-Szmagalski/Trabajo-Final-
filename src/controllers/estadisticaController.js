const { validationResult } = require('express-validator');
const estadisticaBD = require('../database/estadisticaBD');

// Buscar las estadisticas
const obtenerEstadistica = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ estado: 'ERROR', msj: errors.mapped() });
    }

    const { idMateria, idCarrera, nacionalidad } = req.query;

    const estadisticas = await estadisticaBD.estadistica(idMateria, idCarrera, nacionalidad);

    res.status(200).json({ estado: 'OK', dato: estadisticas });
};

module.exports = {
    obtenerEstadistica,
};
