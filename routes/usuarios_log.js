const express = require("express");
const router = express.Router();
const usuariosLogController = require("../controllers/UsuariosLogController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//consultar todos log de un usuario, filtro por fecha y usuario
router.post("/", auth,
    [
        check("fechaInicial", "La fecha inicial es obligatoria").isISO8601().toDate(),
        check("fechaFinal", "La fecha final es obligatoria").isISO8601().toDate(),
        check("usuarioId", "El usuario es obligatorio").not().isEmpty(),
    ], usuariosLogController.traerLogs);

module.exports = router;
