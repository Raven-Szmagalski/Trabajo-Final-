const {Router} = require('express');

const {login } = require('../../controllers/auth');

const router = Router();

// Iniciar sesion
router.post('/login', login); //✓

module.exports = router;
