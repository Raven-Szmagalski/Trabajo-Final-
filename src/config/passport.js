const passport = require('passport');
const passportJWT = require("passport-jwt");
const usuarioDB = require('./../database/usuarioBD');
require('dotenv').config();

const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

// Validacion de Usuarios
passport.use(new LocalStrategy({
        usernameField: 'correoElectronico',
        passwordField: 'clave'
    }, 
    async (correoElectronico, clave, cb) => {
        try {
            console.log('Correo electrónico:', correoElectronico);
            console.log('Clave:', clave);
            const usuario = await usuarioDB.buscar(correoElectronico, clave); 
            if (!usuario) {
                console.log('Usuario no encontrado.');
                return cb(null, false, { message: 'Nombre de usuario y/o contraseña incorrectos.' });
            } else {
                console.log('Usuario encontrado:', usuario);
                return cb(null, usuario, { message: 'Login correcto!' });
            }
        } catch (exc) {
            console.error('Error en la autenticación:', exc);
            cb(exc);
        }
    }
));

// Tokens
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET 
}, 
    async (jwtPayload, cb) => {
        console.log('Payload del token JWT:', jwtPayload);
        const usuario = await usuarioDB.buscarPorId(jwtPayload.idUsuario); 
        if (usuario) {
            console.log('Usuario autenticado:', usuario);
            return cb(null, usuario);
        } else {
            console.log('Token incorrecto.');
            return cb(null, false, { message: 'Token incorrecto.' });
        }
    }
));
