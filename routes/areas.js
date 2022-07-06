const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const areasController = require("../controllers/AreasController");
const { check } = require("express-validator");


router.post('/crear', auth,
    [
        check("nombre", "El Nombre es obligatorio").not().isEmpty(),
        check("ubicacion", "La ubicación es obligatoria").not().isEmpty()
    ]
    , areasController.crearArea);
router.get('/traertodas', auth, areasController.traerAreas);
router.put('/actualizar/:id', auth, areasController.actualizarArea);
router.delete('/eliminar/:id', auth, areasController.eliminarArea);

module.exports = router;