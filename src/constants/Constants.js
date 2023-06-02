require("dotenv").config({ path: ".env.dev" });
exports.Constants = {
    TIPOS_USUARIOS: {
        ADMIN: "admin",
        ESTANDAR: "estandar",
        ESPECIAL: "especial",
    },
    APP_PORT: process.env.APP_PORT || 4000,
    APP_HOST: process.env.APP_HOST || "10.1.3.110",
    APP_FRONTEND_URL: process.env.APP_FRONTEND_URL || "http://10.1.3.110:4102",
    SECRETA: process.env.SECRETA,
    URL_SERVIDOR: `${process.env.APP_HOST}:${process.env.APP_PORT}/public/`,
    TIPOS_DOCUMENTOS_CARGUE: {
        PDF: "pdf",
        IMAGENES: "imagenes",
    }
    
}