const modeloUsuariosLog = require("../models").Usuarios_log;
const modeloUsuarios = require("../models").Usuarios;
const { Constants } = require("../constants/Constants");
const { Op } = require("sequelize");

const traerLogs = async (req, res) => {
    const fechaInicial = req.body.fechaInicial;
    const fechaFinal = req.body.fechaFinal;
    const usuarioId = req.body.usuarioId;
    const usuarioFilter = usuarioId ? usuarioId : { [Op.ne]: null };
    const { perfil, nombres, apellidos } = req.usuario;
    try {
        if (perfil === Constants.TIPOS_USUARIOS.ADMIN) {
            const logs = await modeloUsuariosLog.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    idUsuario: usuarioFilter,
                    createdAt: {
                        [Op.between]: [fechaInicial, fechaFinal]
                    }
                },
                include: [{
                    model: modeloUsuarios,
                    attributes: ['id', 'nombres', 'apellidos']
                }],

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