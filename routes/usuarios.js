const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/UsuariosController");
const { check } = require("express-validator");
const auth = require("../middleware/auth");
const createFoto = require("../utils/crearFoto");

//DEVUELVE TODOS LOS USUARIOS
router.get("/traertodos",auth, usuariosController.traerUsuarios);
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
], usuariosController.crearUsuario);
router.get("/traer/:id", auth, usuariosController.traerUsuarioxId);
router.put("/actualizar/:id", auth, createFoto, usuariosController.actualizarUsuario);
router.delete("/eliminar/:id", auth, usuariosController.eliminarUsuario);

module.exports = router;