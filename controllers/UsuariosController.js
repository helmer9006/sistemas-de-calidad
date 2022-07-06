const modeloUsuarios = require("../models").Usuarios;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Constants } = require("../constants/Constants");


const crearUsuario = async (req, res) => {
    console.log("POST - CREAR USUARIO");
    try {
        //validar errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: false, response: errores.array(), msg: "Error en los datos de entrada" });
        }
        debugger;
        const { perfil, nombres, apellidos } = req.usuario;
        //Valido perfil
        if (perfil === Constants.TIPOS_USUARIOS.ADMIN) {
            // Verificar si el usuario ya estuvo registrado
            const { correo, clave, documento } = req.body;
            //validar que el usuario no esté creado previamente
            let usuarioReg = await modeloUsuarios.findOne({
                where: {
                    [Op.or]: [{ correo }, { documento }]
                }
            });
            if (usuarioReg) {
                return res.json({ status: false, response: usuarioReg, msg: "El usuario ya está registrado" });
            }


            // Hashear clave
            const salt = await bcrypt.genSalt(10);
            req.body.clave = await bcrypt.hash(clave, salt);
            console.log("req.urlfoto", req.urlFoto)

            //crear foto de usuario
            req.body.foto = req.body.foto ? req.urlFoto : "";

            const usuarioCreado = await modeloUsuarios.create(req.body);
            if (!usuarioCreado) {
                return res.json({ status: false, response: {}, msg: "No se pudo crear el usuarios." });
            }

            res.json({ status: true, response: usuarioCreado, msg: "Usuarios creado correctamente." });

        } else {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para crear un usuario`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al crear el usuario" });
    }
}
const traerUsuarios = async (req, res) => {
    console.log("GET - TRAER TODOS LOS USUARIOS");
    try {
        const usuarios = await modeloUsuarios.findAll({});
        if (usuarios.length == 0) {
            return res.json({ status: true, response: [], msg: error });
        }
        res.json({ status: true, response: usuarios, msg: "Usuarios encontrados" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: "Error del servidor al buscar usuarios." });
    }
};
const traerUsuarioxId = async (req, res) => {
    console.log("GET - TRAER USUARIO POR ID");
    try {
        const usuario = await modeloUsuarios.findByPk(req.params.id);
        if (!usuario) {
            return res.json({ status: false, response: {}, msg: "Usuario no encontrado" });
        }
        res.json({ status: true, response: usuario, msg: "usuario encontrado" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: error });
    }
}
const actualizarUsuario = async (req, res) => {
    console.log("PUT - ACTUALIZAR USUARIO");
    try {
        const { perfil, nombres, apellidos } = req.usuario;
        //Valido perfil
        if (perfil === Constants.TIPOS_USUARIOS.ADMIN) {
            //modificar foto de usuario
            if (req.body.foto) {
                req.body.foto = req.urlFoto;
            }
            const usuarioActualizado = await modeloUsuarios.update(req.body, { where: { id: req.params.id } });
            if (usuarioActualizado == 0) {
                return res.json({ status: false, response: {}, msg: "usuario no actualizado" });
            }

            res.json({ status: true, response: usuarioActualizado, msg: "usuario actualizado" });
        } else {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para crear un usuario`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: {}, msg: "Error al actualizar usuario" });
    }
}
const eliminarUsuario = async (req, res) => {
    console.log("DELETE - ELIMINAR USUARIO");
    try {
        const { perfil, nombres, apellidos } = req.usuario;
        //Valido perfil
        if (perfil === Constants.TIPOS_USUARIOS.ADMIN) {
            const usuarioEliminado = await modeloUsuarios.destroy({ where: { id: req.params.id } });
            if (usuarioEliminado == 0) {
                return res.json({ status: false, response: {}, msg: "usuario no eliminado" });
            }
            res.json({ status: true, response: usuarioEliminado, msg: "usuario eliminado" });
        } else {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para eliminar un usuario`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: "Error al eliminar usuario" });
    }
}

module.exports = {
    crearUsuario,
    traerUsuarios,
    actualizarUsuario,
    traerUsuarioxId,
    eliminarUsuario
};
