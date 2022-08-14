const express = require("express");
const router = express.Router();
const initController = require("../controllers/InitController");

//consultar todos log de un usuario, filtro por fecha y usuario
router.get("/", initController.setInitialData);

module.exports = router;