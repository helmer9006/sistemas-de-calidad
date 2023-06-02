const modeloAreas = require("../models").Areas;
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Constants } = require("../constants/Constants");

const crearArea = async (req, res) => {
  console.log("POST-CREAR AREA");
  try {
    //validar errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({
        status: false,
        response: errores.array(),
        msg: "Error en los datos de entrada",
      });
    }

    //valdiar si existe el area
    const areaExistente = await modeloAreas.findOne({
      where: { nombre: req.body.nombre },
    });
    console.log("areaExistente", areaExistente);
    if (areaExistente) {
      return res.json({
        status: false,
        response: {},
        msg: "El área ya existe.",
      });
    }

    const { perfil, nombres, apellidos } = req.usuario;
    //Valido perfil
    if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
      return res.status(403).json({
        status: false,
        response: {},
        msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para crear un área`,
      });
    }
    const { padreId } = req.body
    if (padreId == '') {
      req.body.padreId = null
    }
    const areaCreada = await modeloAreas.create(req.body);
    if (!areaCreada) {
      return res.json({
        status: false,
        response: {},
        msg: "No se pudo crear el área.",
      });
    }
    res.json({
      status: true,
      response: areaCreada,
      msg: "Área creada correctamente.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error al crear el area" });
  }
};
const traerAreas = async (req, res) => {
  console.log("GET - TRAER TODAS LAS ÁREAS");
  try {
    const areas = await modeloAreas.findAll();
    res.json({
      status: true,
      response: areas,
      msg: "Áreas encontradas correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error al traer las áreas" });
  }
};
const actualizarArea = async (req, res) => {
  try {
    console.log("PUT - ACTUALIZAR ÁREA");
    const { perfil, nombres, apellidos } = req.usuario;
    //Valido perfil
    if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
      return res.status(403).json({
        status: false,
        response: {},
        msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para actualizar un área`,
      });
    }
    const { padreId } = req.body
    if (padreId == '') {
      req.body.padreId = null
    }
    const areaActualizada = await modeloAreas.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!areaActualizada) {
      return res.json({
        status: false,
        response: {},
        msg: "No se pudo actualizar el área.",
      });
    }
    res.json({
      status: true,
      response: areaActualizada,
      msg: "Área actualizada correctamente.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      response: {},
      msg: "Error al actualizar el área",
    });
  }
};
const eliminarArea = async (req, res) => {
  try {
    console.log("DELETE - ELIMINAR ÁREA");
    const { perfil, nombres, apellidos } = req.usuario;
    //Valido perfil
    if (perfil === Constants.TIPOS_USUARIOS.ESTANDAR) {
      return res.status(403).json({
        status: false,
        response: {},
        msg: `Acceso no autorizado, el usuario ${nombres} ${apellidos} con perfil ${perfil} no tiene autorización para eliminar un área`,
      });
    }
    const areaEliminada = await modeloAreas.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!areaEliminada) {
      return res.json({
        status: false,
        response: {},
        msg: "No se pudo eliminar el área o no existe.",
      });
    }
    res.json({
      status: true,
      response: areaEliminada,
      msg: "Área eliminada correctamente.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error al eliminar el área" });
  }
};

const traerAreasPorUsuario = async (req, res) => {
  console.log("GET - TRAER TODAS LAS ÁREAS");
  const { idArea } = req.usuario;
  const filter =
    idArea == 1 ? { padreId: null } : { id: idArea, padreId: null }; //id de área 1 equivale a todas
  try {
    const areas = await modeloAreas.findAll({
      where: filter,
    });
    res.json({
      status: true,
      response: areas,
      msg: "Áreas encontradas correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: {}, msg: "Error al traer las áreas" });
  }
};

const traerSubAreas = async (req, res) => {
  console.log("GET - TRAER TODAS LAS SUB ÁREAS");
  const { padreId } = req.params;

  try {
    const areas = await modeloAreas.findAll({
      where: { padreId },
    });
    res.json({
      status: true,
      response: areas,
      msg: "Sub áreas encontradas correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      response: {},
      msg: "Error al traer las sub áreas",
    });
  }
};

const buscarAreaPorNombre = async (req, res) => {
  try {
    const text = req.params.text;
    if (!req.params.text) {
      return res.json({
        status: true,
        msg: "Lista de áreas.",
        response: [],
      });
    }
    const areas = await modeloAreas.findAll({
      where: { nombre: { [Op.like]: `%${text}%` } },
      limit: 10,
    });

    res.json({
      status: true,
      mgs: "Lista de áreas.",
      response: areas,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, response: [], msg: "Error al buscar áreas" });
  }
};
module.exports = {
  crearArea,
  traerAreas,
  actualizarArea,
  eliminarArea,
  traerAreasPorUsuario,
  traerSubAreas,
  buscarAreaPorNombre,
};
