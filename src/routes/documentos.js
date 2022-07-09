const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadDoc = require("../utils/uploadDoc");
const validarTipoDocumentoCargue = require("../middleware/validarTipoDocumento");
const documentosController = require("../controllers/DocumentosController");

router.post("/cargar/:tipoDocumento", auth, validarTipoDocumentoCargue, uploadDoc, documentosController.cargarDocumento);


module.exports = router;