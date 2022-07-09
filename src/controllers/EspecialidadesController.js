const modeloEspecialidades = require("../models").Especialidades;
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Constants } = require("../constants/Constants");
const crearEspecialidad = async (req, res) => {
    try {
        console.log("POST - CREAR ESPECIALIDAD");
        const nombre = req.body.nombre;
        //validar errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: false, response: errores.array(), msg: "Error en los datos de entrada" });
        }

        const { perfil, nombres, apellidos } = req.usuario;
        //Valido perfil
        if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para crear una especialidad`,
            });
        }
        //validar que  no esté creada previamente
        let especialidadReg = await modeloEspecialidades.findOne({
            where: { nombre: nombre }
        });
        if (especialidadReg) {
            return res.json({ status: false, response: especialidadReg, msg: "La especialidad ya está registrada" });
        }

        const especialidadCreada = await modeloEspecialidades.create({ nombre });
        if (!especialidadCreada) {
            return res.json({ status: false, response: {}, msg: "No se pudo crear la especialidad." });
        }

        res.json({ status: true, response: especialidadCreada, msg: "Especialidad creada correctamente." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al crear la especialidad" });
    }
}
const traerEspecialidades = async (req, res) => {
    try {
        console.log("GET - ESPECIALIDADES");
        const especialidades = await modeloEspecialidades.findAll({});
        res.json({ status: true, response: especialidades, msg: "Especialidades creadas correctamente." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al traer las especialidades" });
    }
}

const actualizarEspecialidad = async (req, res) => {
    try {
        console.log("PUT - ACTUALIZAR ESPECIALIDAD");
        const id = req.params.id;
        const nombre = req.body.nombre;
        const { perfil, nombres, apellidos } = req.usuario;
        //Valido perfil
        if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para actualizar una especialidad`,
            });
        }
        //validar errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: false, response: errores.array(), msg: "Error en los datos de entrada" });
        }
        const especialidadActualizada = await modeloEspecialidades.update({ nombre }, { where: { id } });
        if (!especialidadActualizada) {
            return res.json({ status: false, response: {}, msg: "No se pudo actualizar la especialidad o no existe." });
        }
        res.json({ status: true, response: especialidadActualizada, msg: "Especialidad actualizada correctamente." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al actualizar las especialidades" });
    }
}

const eliminarEspecialidad = async (req, res) => {
    try {
        const id = req.params.id;
        const { perfil, nombres, apellidos } = req.usuario;
        //Valido perfil
        if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para eliminar una especialidad`,
            });
        }
        const especialidadEliminada = await modeloEspecialidades.destroy({ where: { id } });
        if (!especialidadEliminada) {
            return res.json({ status: false, response: {}, msg: "No se pudo eliminar la especialidad o no existe." });
        }
        res.json({ status: true, response: especialidadEliminada, msg: "Especialidad eliminada correctamente." });
    } catch (error) {
        console.log("Error al eliminar especialidad", error);
        res.status(500).json({ status: false, response: {}, msg: "Error al eliminar especialidad" });
    }
}


module.exports = {
    crearEspecialidad,
    traerEspecialidades,
    actualizarEspecialidad,
    eliminarEspecialidad
}