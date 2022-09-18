const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const protocolosController = require("../controllers/ProtocolosController");
const { check } = require("express-validator");
const { Router } = require("express");
// const crearFoto = require('../utils/crearFoto');

router.post("/crear", auth, [
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("idEspecialidad", "La especialidad es obligatoria").not().isEmpty(),
    check("idArea", "El area es obligatoria").not().isEmpty(),
    check("url", "La url del documento es obligatoria").not().isEmpty(),
] , protocolosController.crearProtocolo);

router.put("/actualizar/:id", auth,  protocolosController.actualizarProtocolo);
router.delete("/eliminar/:id", auth, protocolosController.eliminarProtocolo);
router.get("/traertodos/:idArea/:idEspecialidad/:busqueda", auth, protocolosController.traerProtocolos);
module.exports = router;