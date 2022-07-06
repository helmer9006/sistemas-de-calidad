const modeloUsuariosLog = require("../models").Usuarios_log;
const { Constants } = require("../constants/Constants");
const { Op } = require("sequelize");

const traerLogs = async (req, res) => {
    const fechaInicial = req.body.fechaInicial;
    const fechaFinal = req.body.fechaFinal;
    const usuarioId = req.body.usuarioId;
    const { perfil, nombres, apellidos } = req.usuario;
    try {
        if (perfil === Constants.TIPOS_USUARIOS.ADMIN) {
            const logs = await modeloUsuariosLog.findAll({
                where: {
                    idUsuario: usuarioId,
                    createdAt: {
                        [Op.between]: [fechaInicial, fechaFinal]
                    }
                },
            });
            res.json({ status: true, response: logs, msg: "Registros consultados correctamente." });
        } else {
            return res.status(403).json({
                status: false, response: {}, msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para consultar logs`,
            });
        }
    } catch {
        res.status(500).json({ status: false, response: [], msg: "Error, no se pudo realizar la consulta" });
    }
}

module.exports = {
    traerLogs
}