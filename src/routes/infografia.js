const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {check} = require("express-validator");
const inforgrafiaController = require("../controllers/infografiaController");

router.get('/traertodas', auth,  inforgrafiaController.traerInfografia);
router.post('/crear', auth, [
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    check("url", "La url es obligatoria").not().isEmpty()
], inforgrafiaController.crearInfografia);
router.delete('/eliminar/:id', auth, inforgrafiaController.eliminarInfografia);

module.exports = router;