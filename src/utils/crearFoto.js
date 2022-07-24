const fs = require("fs");
const separarCadenas = require("./separarCadenas");
const { Constants } = require("../constants/Constants");
const path = require('path');
module.exports = (req, res, next) => {
    const foto = req.body.foto;

    if (!foto) {
        return next();
    }
    const espacio = " ";
    const coma = ",";
    const result = separarCadenas(foto, coma);
    const nombreArchivo = Math.random().toString(36) + `.${result.extension}`;
    let ruta = path.join(__dirname, `./../../uploads/imagenes/`);
    //crear foto
    fs.writeFileSync(`${ruta}` + nombreArchivo, result.file, "base64", (error) => {
        if (error) console.log(error);
    });
    req.urlFoto = `${Constants.APP_HOST}:${Constants.APP_PORT}/public/imagenes/${nombreArchivo}`;
    return next();
};
