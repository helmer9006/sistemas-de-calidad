
const { Constants } = require("../constants/Constants");
const uploadDoc = require("../utils/uploadDoc");
const cargarDocumento = async (req, res) => {
    //tipoDocumento puede ser pdf o imagenes que son las carpetas que existen en uploads
    console.log("POST - CARGAR DOCUMENTO");
    if (!req.nombreDocumento) {
        return res.status(400).json({ status: false, response: {}, msg: "Error al cargar documento." });
    }
    res.json({ status: true, response: { url: `${Constants.URL_SERVIDOR}${req.params.tipoDocumento}/${req.nombreDocumento}` }, msg: "Se cargó correctamente el documento." });
}

module.exports = {
    cargarDocumento
}