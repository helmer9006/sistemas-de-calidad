const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');


router.post('/', 
    [
        check('correo', 'Agrega un correo válido.').isEmail(),
        check('clave', 'La clave no puede estar vacía.').not().isEmpty()
    ],
    authController.autenticarUsuario
);

router.get('/logout', auth, authController.logout);

router.get('/',
    auth,
    authController.usuarioAutenticado
);


module.exports = router;