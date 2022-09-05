// const Usuario = require("../models/Usuarios");
const modeloUsuarios = require("../models").Usuarios;
const modeloUsuariosLogs = require("../models").Usuarios_log;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env.dev" });
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Constants } = require("../constants/Constants");
exports.autenticarUsuario = async (req, res, next) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // Buscar el usuario para ver si esta registrado
    const { correo, clave } = req.body;

    let usuario = await modeloUsuarios.findOne({
        where: {
            [Op.or]: [{ correo }]
        }
    });
    if (!usuario) {
        return res.status(401).json({ status: false, response: usuario, msg: "El Usuario no existe" });
    }

    if (usuario?.estado == false) {
        return res.status(401).json({ status: false, response: usuario, msg: "El Usuario está deshabilitado" });
    }

    // Verificar el password y autenticar el usuario

    if (bcrypt.compareSync(clave, usuario.clave)) {
        // Crear JWT
        const token = jwt.sign(
            {
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                correo: usuario.correo,
                perfil: usuario.perfil,
                estado: usuario.estado,
                createdAt: usuario.createdAt,
                updatedAt: usuario.updatedAt,
                idArea: usuario.idArea,
                idEspecialidad: usuario.idEspecialidad,
                tipoDoc: usuario.tipoIdentificacion,
                documento: usuario.identificacion,
                fechaNacimiento: usuario.fechaNacimiento,
                celular: usuario.celular,
                foto: usuario.foto,
            },
            Constants.SECRETA,
            {
                expiresIn: "8h",
            }
        );
        //crear registro de log de usuarios_logs
        await modeloUsuariosLogs.create({
            idUsuario: usuario.id,
            descripcion: "Ingreso al sistema"
        });
        res.json({
            status: true,
            response: {
                usuarioId: usuario.id,
                token: token,
                perfil: usuario.perfil,
                nombre: `${usuario.nombres} ${usuario.apellidos}`,
                foto: usuario.foto,
                idArea: usuario.idArea,
                idEspecialidad: usuario.idEspecialidad,
                fechaNacimiento: usuario.fechaNacimiento,
                celular: usuario.celular,
                tipoDoc: usuario.tipoIdentificacion,
                documento: usuario.documento,
                correo: usuario.correo,
                estado: usuario.estado,
                createdAt: usuario.createdAt
            },
            msg: "Usuario logueado correctamente."
        });
    } else {
        res.status(401).json({ status: false, response: null, msg: "Correo o clave incorrecto" });
        return next();
    }
};

exports.usuarioAutenticado = (req, res, next) => {
    res.json({ usuario: req.usuario });
};

exports.logout = async (req, res, next) => {
    const usuario = req.usuario;
    //crear registro de log de usuarios_logs
    await modeloUsuariosLogs.create({
        idUsuario: usuario.id,
        descripcion: "Salida del sistema"
    });

    res.json({ status: true, msg: "Sesión finalizada correctamente." });
}
