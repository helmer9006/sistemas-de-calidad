const modeloUsuarios = require("../models").Usuarios;
const modeloAreas = require("../models").Areas;
const modeloEspecialidades = require("../models").Especialidades;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Constants } = require("../constants/Constants");
const path = require('path');
const Utils = require("../utils/general");
const {sequelize} = require('../models');

const crearUsuario = async (req, res) => {
    console.log("POST - CREAR USUARIO");
    try {
        //validar errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ status: false, response: errores.array(), msg: "Error en los datos de entrada" });
        }
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
        const usuarios = await modeloUsuarios.findAll({
            include: [{
                model: modeloEspecialidades,
                as: 'Especialidad',
            }, {
                model: modeloAreas,
            }]
        });
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
        const usuario = await modeloUsuarios.findByPk(req.params.id, {
            include: [{
                model: modeloEspecialidades,
                as: 'Especialidad',
            }, {
                model: modeloAreas,
            }]
        });
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
            debugger;
            if (req.body.foto) {
                req.body.foto = req.urlFoto;
            }
            console.log("req.usuario.foto", req.usuario)
            const fotoUsuario = await modeloUsuarios.findOne({ where: { id: req.params.id }, attributes: ['foto'] });
            if (!req.body.foto) {
                req.body.foto = fotoUsuario.foto;
            } else {
                if (fotoUsuario.foto != req.urlFoto) {
                    const fotoEliminadoUrl = fotoUsuario.foto.split("/")[5];
                    const directorio = fotoUsuario.foto.split("/")[4];
                    const ruta = path.join(__dirname, `./../../uploads/${directorio}/${fotoEliminadoUrl}`);
                    await Utils.eliminarArchivo(ruta);
                    req.body.foto = req.urlFoto;
                }
            }

            console.log("req.body, ", req.body)
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

const cambiarClave = async (req, res) => {
    console.log("PUT - CAMBIAR CLAVE");
    try {
        const { clave, nuevaClave, idUsuario } = req.body;

        //validar errores
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.json({ status: false, response: errores.array(), msg: "Error en los datos de entrada" });
        }

        const usuario = await modeloUsuarios.findByPk(idUsuario);

        if (!usuario) {
            return res.status(401).json({ status: false, response: {}, msg: "El usuario al que desea actualizar la clave no fue encontrado." });
        }
        if (!bcrypt.compareSync(clave, usuario.clave)) {
            return res.status(401).json({ status: false, response: {}, msg: "La clave antigua es incorrecta, intente nuevamente con otra." });
        }

        // Hashear clave
        const salt = await bcrypt.genSalt(10);
        let claveParaCambiar = await bcrypt.hash(nuevaClave, salt);
        const usuarioActualizado = await modeloUsuarios.update({ clave: claveParaCambiar }, { where: { id: idUsuario } });
        if (usuarioActualizado == 0) {
            return res.json({ status: false, response: {}, msg: `La clave no pudo ser actualizada, intente nuevamente.` });
        }
        res.json({ status: true, response: usuario, msg: `La clave del usuario ${usuario.nombres} ${usuario.apellidos} fue actualizada` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: "Error al cambiar clave" });
    }
}

const cambiarEstado = async (req, res) => {
    console.log("GET - CAMBIAR ESTADO");
    try {
        const { perfil, nombres, apellidos } = req.usuario;
        //Valido perfil
        if (perfil != Constants.TIPOS_USUARIOS.ADMIN) {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para cambiar el estado de un usuario`,
            });
        }
        const usuarioActualizado = await modeloUsuarios.sequelize.query(` UPDATE usuarios  SET estado = NOT estado WHERE id = ${parseInt(req.params.id)};`);

        if (usuarioActualizado == 0) {
            return res.json({ status: false, response: {}, msg: "El estado del usuario no se ha actualizado" });
        }
        res.json({ status: true, response: usuarioActualizado, msg: "El estado del usuario se ha actualizado" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: "Error al cambiar estado" });
    }
}

const cambiarFoto = async (req, res) => {
    try {
        const { idUsuario, foto } = req.body;

        const usuarioActualizado = await modeloUsuarios.update({ foto: foto }, { where: { id: idUsuario } });

        if (usuarioActualizado == 0) {
            return res.json({ status: false, response: {}, msg: "La foto no se ha actualizado" });
        }
        res.json({ status: true, response: usuarioActualizado, msg: "La foto se ha actualizado correctamente." });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: "Error al cambiar foto" });
    }

}

const buscarUsuarioPorNombre = async (req, res) => {
    try {
        const text = req.params.text;
        if (!req.params.text) {
            return res.json({
                status: true,
                msg: "Lista de usuarios.",
                response: []
            });
        }
        const usuarios = await modeloUsuarios.findAll({
            where: {
                [Op.or]: {
                    nombres: { [Op.like]: `%${text}%` },
                    apellidos: { [Op.like]: `%${text}%` }
                },
            },
            limit: 12
        });

        res.json
            ({
                status: true,
                mgs: "Lista de usuarios.",
                response: usuarios
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: "Error al buscar usuario" });
    }

};

const cumpleañeros = async (req, res) => {
    try {
        const cumpleañeros = await modeloUsuarios.sequelize.query("SELECT CONCAT(nombres, ' ', apellidos) as 'nombreCompleto', id, foto, fechaNacimiento, concat_ws( '-',year(curdate()) + if( (month(fechaNacimiento),day(fechaNacimiento)) < (month(curdate()),day(curdate())),1, 0 ), month(fechaNacimiento), day(fechaNacimiento)) AS 'FechaCumple' FROM usuarios WHERE estado = 1 ORDER BY 5 ASC LIMIT 6;");
        if(cumpleañeros.length == 0){
            return res.json({
                status: true,
                msg: "No hay cumpleañeros.",
                response: []
            });
        }
       return res.json({ status: true, msg: "Lista de cumpleañeros.", response: cumpleañeros }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, response: [], msg: "Error al buscar cumpleañeros" });
    }
}

module.exports = {
    crearUsuario,
    traerUsuarios,
    actualizarUsuario,
    traerUsuarioxId,
    eliminarUsuario,
    cambiarClave,
    cambiarEstado,
    cambiarFoto,
    buscarUsuarioPorNombre,
    cumpleañeros
};
