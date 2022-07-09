const separarCadenas = require("./separarCadenas");
const fs = require("fs");
const { Constants } = require("../constants/Constants");
module.exports = (req, res, next) => {
    const foto = req.body.foto;

    if (!foto) {
        return next();
    }
    const espacio = " ";
    const coma = ",";
    const result = separarCadenas(foto, coma);
    const nombreArchivo = Math.random().toString(36) + `.${result.extension}`;

    //crear foto
    fs.writeFile(`./uploads/images/` + nombreArchivo, result.file, "base64", (error) => {
        if (error) console.log(error);
    });
    req.urlFoto = `${Constants.APP_HOST}:${Constants.APP_PORT}/public/images/${nombreArchivo}`;
    return next();
};
