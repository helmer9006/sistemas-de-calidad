
const { Constants } = require("../constants/Constants");
module.exports = (req, file, res, next) => {
    console.log("VALIDA - TIPO DE DOCUMENTO");
    const tipo = req.params.tipoDocumento;
    //se valida si viene un formato permitido
    const validacion = [
        Constants.TIPOS_DOCUMENTOS_CARGUE.IMAGENES,
        Constants.TIPOS_DOCUMENTOS_CARGUE.PDF].includes(tipo.trim());

    if (!validacion) {
        return res.status(400).json({ status: false, response: {}, msg: "El documento enviado no está permitido." });
    }

    return next();
};