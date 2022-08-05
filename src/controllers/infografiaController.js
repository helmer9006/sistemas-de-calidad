const modeloInfografia = require("../models").infografia;


const { Constants } = require("../constants/Constants");
const { validationResult } = require("express-validator");


const traerInfografia = async (req, res) => {

    try {
        const infografia = await modeloInfografia.findAll({});
        if (!infografia) {
            return res.json({ status: false, response: {}, msg: "No se pudo consultar las infografias" });
        }

        res.json({ status: true, response: infografia, msg: "Lista de infografías." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al consultar las infografías" });
    }


}

const crearInfografia = async (req, res) => {
    try {
        const { descripcion, url } = req.body;
        const { perfil, nombres, apellidos } = req.usuario;

        //validar errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: false, response: errores.array(), msg: "Error en los datos de entrada" });
        }
        //Valido perfil
        if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para crear una infografía`,
            });
        }

        const infografiaCreada = await modeloInfografia.create({ descripcion, url });
        if (!infografiaCreada) {
            return res.json({ status: false, response: {}, msg: "No se pudo crear la infografía." });
        }
        res.json({ status: true, response: infografiaCreada, msg: "Infografía creada correctamente." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al crear la infografia" });
    }
}

const eliminarInfografia = async (req, res) => {
    try {
        const { id } = req.params;
        const { perfil, nombres, apellidos } = req.usuario;

        //validar perfil
        if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para eliminar una infografía`,
            });
        }
        infografiaEliminada = await modeloInfografia.destroy({ where: { id } });
        if (!infografiaEliminada) {
            return res.json({ status: false, response: {}, msg: "No se pudo eliminar la infografía." });
        }
        res.json({ status: true, response: infografiaEliminada, msg: "Infografía eliminada correctamente." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al eliminar la infografía" });
    }
}

module.exports = {
    traerInfografia,
    crearInfografia,
    eliminarInfografia
}