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
                tipoDoc: usuario.tipoIdentificacion,
                documento: usuario.identificacion,
                fechaNacimiento: usuario.fechaNacimiento,
                celular: usuario.celular,
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
        res.json({ status: true, response: { token: token }, msg: "Usuario logueado correctamente." });
    } else {
        res.status(401).json({ status: true, response: null, msg: "Correo o clave incorrecto" });
        return next();
    }
};

exports.usuarioAutenticado = (req, res, next) => {
    res.json({ usuario: req.usuario });
};
