const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/UsuariosController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const createFoto = require("../utils/crearFoto");

//DEVUELVE TODOS LOS USUARIOS
router.get("/traertodos", auth, usuariosController.traerUsuarios);
router.get("/traer/:id", auth, usuariosController.traerUsuarioxId);
router.get("/cambiarestado/:id", auth, usuariosController.cambiarEstado);
router.post("/crear",
    auth,
    createFoto,
    [
        check("nombres", "El Nombre es obligatorio").not().isEmpty(),
        check("apellidos", "El apellido es obligatorio").not().isEmpty(),
        check("tipoDoc", "El tipo de identificacion es obligatorio").not().isEmpty(),
        check("documento", "El número de documento es obligatorio").not().isEmpty(),
        check('correo', 'Agrega un correo válido.').isEmail(),
        check('clave', 'La clave no puede estar vacía y debe contener mínimo 6 caracteres.').isLength({ min: 6 }),
        check("perfil", "El perfil es obligatorio").not().isEmpty(),
        check('fechaNacimiento').isISO8601().toDate(),
        check("foto", "La foto es obligatoria").not().isEmpty(),
    ], usuariosController.crearUsuario);

router.put("/actualizar/:id", auth, createFoto, usuariosController.actualizarUsuario);
router.delete("/eliminar/:id", auth, usuariosController.eliminarUsuario);
router.put("/cambiarclave/", auth,
    [
        check('clave', 'La clave no puede estar vacía y debe contener mínimo 6 caracteres.').isLength({ min: 6 }),
        check('nuevaClave', 'La nueva clave no puede estar vacía y debe contener mínimo 6 caracteres.').isLength({ min: 6 }),
        check('idUsuario', 'El id del usuario es obligatorio').not().isEmpty().isNumeric(),

    ], usuariosController.cambiarClave);

module.exports = router;