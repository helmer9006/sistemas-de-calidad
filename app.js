const express = require("express");
const cors = require("cors");

// crear el servidor
const app = express();

// Habilitar leer los valores de un body
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//permitir cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL,
};
app.use(cors(opcionesCors));

// Puerto de la app
const port = process.env.PORT || 4000;

// Rutas de la app
app.use("/api/usuarios", require("./routes/usuarios"));
// app.use("/api/protocolos", require("./routes/protocolos"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/areas", require("./routes/areas"));
app.use("/api/usuarios-log", require("./routes/usuarios_log"));
app.use("/public", express.static(`${__dirname}/uploads`)); // Habilitar carpeta publica

// Arrancar la app
app.listen(port, "0.0.0.0", () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});
