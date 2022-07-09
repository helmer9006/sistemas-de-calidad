const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const especialidadesController = require("../controllers/EspecialidadesController");
const { check } = require("express-validator");


router.post('/crear', auth,
    [
        check("nombre", "El Nombre es obligatorio").not().isEmpty()
    ]
    , especialidadesController.crearEspecialidad);
router.get('/traertodas', auth, especialidadesController.traerEspecialidades);
router.put('/actualizar/:id', auth, [
    check("nombre", "El Nombre es obligatorio").not().isEmpty()
], especialidadesController.actualizarEspecialidad);
router.delete('/eliminar/:id', auth, especialidadesController.eliminarEspecialidad);

module.exports = router;