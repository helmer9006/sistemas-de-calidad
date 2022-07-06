const jwt = require("jsonwebtoken");
const {Constants} = require("../constants/Constants");
module.exports = (req, res, next) => {
    console.log("POST - AUTENTICACIÓN");
    const authHeader = req.get("Authorization");
    if (authHeader) {
        // Obtener el Token
        const token = authHeader.split(" ")[1];
        if (token) {
            // comprobar el JWT
            try {
                const usuario = jwt.verify(token, Constants.SECRETA);
                req.usuario = usuario;
            } catch (error) {
                return res.status(403).json({ status: false, response: usuario, msg: "Acceso no autorizado o sesión caducada." });
            }
        } else {
            return res.status(403).json({ status: false, response: {}, msg: "Acceso no autorizado." });
        }
    } else {
        console.log("falta el encabezado");
        return res.status(403).json({ status: false, response: {}, msg: "falta el encabezado." });
    }
    return next();
};