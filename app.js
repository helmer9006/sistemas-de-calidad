const express = require("express");
const cors = require("cors");

// crear el servidor
const app = express();

// Habilitar leer los valores de un body
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//permitir cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL,
};
app.use(cors(opcionesCors));

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
app.use("/public", express.static(`${__dirname}/uploads`)); // Habilitar carpeta publica

// Arrancar la app
app.listen(port, "0.0.0.0", () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});
