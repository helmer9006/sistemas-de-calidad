const modeloUsuarios = require("../models").Usuarios;
const modeloAreas = require("../models").Areas;
const modeloEspecialidades = require("../models").Especialidades;
const { Constants } = require("../constants/Constants");
const { Op, sequelize } = require("sequelize");

const setInitialData = async (req, res) => {
    try {

        //eliminar registros
        // await modeloAreas.destroy({ where: { id: 1 } });
        // await modeloEspecialidades.destroy({ where: { id: 1 } });
        // await modeloUsuarios.destroy({ where: { id: 1 } });

        //crear registro iniciales
        const area = await modeloAreas.create({
            id: 1,
            nombre: "Todas",
            ubiacion: "Todas",
            imagen: 'https://cdn.euroinnova.edu.es/img/subidasEditor/istock_000024206907_xxxlarge-1610545662.webp'
        })
        const especialidad = await modeloEspecialidades.create({
            id: 1,
            nombre: "Todas",
        })
        const usuario = await modeloUsuarios.create({
            id: 1,
            nombres: 'Helmer',
            apellidos: 'Villarreal',
            tipoDoc: 'CC',
            documento: '105163530',
            correo: 'helmervillarreal@gmail.com',
            fechaNacimiento: '1990-08-06 00:00:00',
            celular: '3013555186',
            clave: '$2b$10$cu8ewRjBzMEgECHMYZtn0eR3.wo.bE27aCFQ/VKvNyJ9ZH1VCLnh6',
            perfil: 'admin',
            estado: 1,
            idArea: 1,
            idEspecialidad: 1,
            foto: 'http://localhost:4000/public/imagenes/0.g695g9o8ogj.png'
        });

        if (area && especialidad && usuario) {
            return res.status(200).json({ status: true, response: [usuario, area, especialidad], msg: "Se crearon los datos iniciales correctamente." });
        } else {
            return res.status(500).json({ status: false, response: null, msg: "Error al crear los datos iniciales" });
        }

    } catch {
        res.status(500).json({ status: false, response: [], msg: "Error, no se pudo realizar la consulta" });
    }
}

module.exports = {
    setInitialData
}