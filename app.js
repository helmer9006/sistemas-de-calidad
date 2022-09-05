const express = require("express");
const cors = require("cors");
const { Constants } = require("./src/constants/Constants");
// crear el servidor
const app = express();

// Habilitar leer los valores de un body
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

//permitir cors
const opcionesCors = {
    origin: Constants.APP_FRONTEND_URL
};
// app.use(cors(opcionesCors));
app.use(cors());

// Puerto de la app
const port = process.env.PORT || 4000;

// Rutas de la app
app.use("/api/usuarios", require("./src/routes/usuarios"));
// app.use("/api/protocolos", require("./routes/protocolos"));
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/areas", require("./src/routes/areas"));
app.use("/api/especialidades", require("./src/routes/especialidades"));
app.use("/api/usuarios-log", require("./src/routes/usuarios_log"));
app.use("/api/protocolos", require("./src/routes/protocolos"));
app.use("/api/documentos", require("./src/routes/documentos"));
app.use("/api/infografia", require("./src/routes/infografia"));
app.use("/api/dataInicial", require("./src/routes/init"));
app.use("/api/logout", require("./src/routes/auth"));
app.use("/public", express.static(`${__dirname}/uploads`)); // Habilitar carpeta publica

// Arrancar la app
app.listen(port, "0.0.0.0", () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});
