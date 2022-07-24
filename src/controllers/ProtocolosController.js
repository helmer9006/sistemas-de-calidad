const modeloProtocolos = require("../models").Protocolos;
const modeloUsuarios = require("../models").Usuarios;
const modeloAreas = require("../models").Areas;
const modeloEspecialidades = require("../models").Especialidades;

const { validationResult } = require("express-validator");
const { Constants } = require("../constants/Constants");
const fs = require('fs');
const path = require('path');
const Utils = require("../utils/general");
const { Op } = require("sequelize");

const crearProtocolo = async (req, res) => {
    try {
        debugger;
        console.log("POST - CREAR PROTOCOLO");
        const { perfil, id, nombres, apellidos } = req.usuario;
        //validar errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: false, response: errores.array(), msg: "Error en los datos de entrada" });
        }
        //Valido perfil
        if (perfil == Constants.TIPOS_USUARIOS.ESTANDAR) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para crear un protocolos`,
            });
        }
        req.body.creadoPor = id;
        const protocoloCreado = await modeloProtocolos.create(req.body);
        if (!protocoloCreado) {
            return res.json({ status: false, response: {}, msg: "No se pudo crear el protocolo." });
        }
        res.json({ status: true, response: protocoloCreado, msg: "Protocolo creado correctamente." });
    } catch {
        res.status(500).json({
            status: false,
            response: {},
            msg: "Error al crear el protocolo."
        });
    }
}

const actualizarProtocolo = async (req, res) => {
    try {
        console.log("PUT - ACTUALIZAR PROTOCOLO");
        const { perfil, nombres, apellidos } = req.usuario;

        //Valido perfil
        if (perfil == Constants.TIPOS_USUARIOS.ESTANDAR) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para actualizar un protocolos`,
            });
        }

        //consultamos el protocolo para tener la info del archivo a uctualizar
        const urlprotocolo = await modeloProtocolos.findOne({
            attributes: ['url'],
            where: { id: req.params.id }
        });

        const protocoloActualizado = await modeloProtocolos.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        if (!protocoloActualizado) {
            return res.json({ status: false, response: {}, msg: "No se pudo actualizar el protocolo." });
        }
        //eliminar archivo si se actualiza el url del archivo
        if (req.body.url && urlprotocolo && req.body.url !== urlprotocolo.url) {
            const protocoloEliminadoUrl = urlprotocolo.url.split("/")[5];
            const directorio = urlprotocolo.url.split("/")[4];
            const ruta = path.join(__dirname, `./../../uploads/${directorio}/${protocoloEliminadoUrl}`);
            await Utils.eliminarArchivo(ruta);
        }

        res.json({ status: true, response: protocoloActualizado, msg: "Protocolo actualizado correctamente." });

    } catch (error) {
        console.log("Error al actualizar el protocolo", error);
        res.status(500).json({ status: false, response: {}, msg: "Error al actualizar el protocolo" });
    }
}

const eliminarProtocolo = async (req, res) => {
    try {
        debugger;
        console.log("DELETE - ELIMINAR PROTOCOLO");
        const { perfil, nombres, apellidos } = req.usuario;

        //Valido perfil
        if (perfil == Constants.TIPOS_USUARIOS.ESTANDAR || perfil == Constants.TIPOS_USUARIOS.ESPECIAL) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para eliminar un protocolos`,
            });
        }
        //consultamos el protocolo para tener la info del archivo a eliminar
        const urlprotocolo = await modeloProtocolos.findOne({
            attributes: ['url'],
            where: { id: req.params.id }
        });

        const protocoloEliminado = await modeloProtocolos.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!protocoloEliminado) {
            return res.json({ status: false, response: {}, msg: "No se pudo eliminar el protocolo." });
        }

        const protocoloEliminadoUrl = urlprotocolo.url.split("/")[5];
        const directorio = urlprotocolo.url.split("/")[4];
        const ruta = path.join(__dirname, `./../../uploads/${directorio}/${protocoloEliminadoUrl}`);
        await Utils.eliminarArchivo(ruta); //elimina el archivo

        res.json({ status: true, response: protocoloEliminado, msg: "Protocolo eliminado correctamente." });

    } catch (error) {
        console.log("Error al eliminar el protocolo", error);
        res.status(500).json({ status: false, response: {}, msg: "Error al eliminar el protocolo" });
    }
}

const traerProtocolos = async (req, res) => {
    try {
        console.log("GET - TRAER PROTOCOLOS");
        //filtrar por area, especialidad, valor/palabra busqueda
        const idArea = req.params.idArea ? parseInt(req.params.idArea) : 0;
        const idEspecialidad = req.params.idEspecialidad ? parseInt(req.params.idEspecialidad) : 0;
        const busqueda = req.params.busqueda ? req.params.busqueda : "empty";
        let filter = {};
        debugger;
        if (idArea && idEspecialidad) {
            filter = { idArea, idEspecialidad };
        } else if (!idArea && !idEspecialidad) {
            filter = {};
        }
        else if (!idArea) {
            filter = { idEspecialidad };
        } else {
            filter = { idArea };
        }

        if (busqueda !== "empty") {
            filter.nombre = { [Op.like]: `%${busqueda.toLowerCase()}%` }
        }
        const protocolos = await modeloProtocolos.findAll({
            order: [['createdAt', 'DESC']],
            where: filter,
            include: [{
                model: modeloUsuarios,
            }, {
                model: modeloEspecialidades,
                as: 'Especialidad',
            }, {
                model: modeloAreas,
            }]

        });

        res.json({ status: true, response: protocolos, msg: "Protocolos traidos correctamente." });
    } catch (error) {
        console.log("Error al traer los protocolos", error);
        res.status(500).json({ status: false, response: {}, msg: "Error al traer los protocolos" });
    }
}

module.exports = {
    crearProtocolo,
    actualizarProtocolo,
    eliminarProtocolo,
    traerProtocolos
}