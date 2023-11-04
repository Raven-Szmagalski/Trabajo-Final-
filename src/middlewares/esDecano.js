const jwt = require('jsonwebtoken');
const usuarioDB = require('../database/usuarioBD');

require('dotenv').config();

//Usuario Decano = 0
const esDecano = async (req, res, next) => {
    
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

        if (data.tipoUsuario == 0) {
            return res.status(403).send({ status: "Fallo", data: { error: "No tiene los privilegios necesarios." } });
        }

        console.log("Usuario autenticado como Decano:", data);

        next();
    });
};

module.exports = { esDecano };
