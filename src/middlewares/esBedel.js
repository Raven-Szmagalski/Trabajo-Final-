const jwt = require('jsonwebtoken');
const usuarioDB = require('../database/usuarioBD');

require('dotenv').config();

//Usuario Bedel = 1
const esBedel = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, usuario) => {
        if (err) {
            return res.status(403).send({ status: "Fallo", data: { error: "Token inválido." } }); 
        }

        const data = await usuarioDB.buscarPorId(usuario.idUsuario);

        if (data.tipoUsuario == 1) {
            return res.status(403).send({ status: "Fallo", data: { error: "No tiene los privilegios necesarios." } });
        }

        console.log("Usuario autenticado como Bedel:", data);

        next();
    });
};

module.exports = { esBedel };