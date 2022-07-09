const fs = require('fs');

exports.eliminarArchivo = (url) => {
    let resultado = function (err) {
        let respuesta = {};
        if (err) {
            console.log("Error al eliminar el archivo url ", url);
            console.log("Error", err);
        } else {
            console.log("Archivo eliminado correctamente url ", url);
        }
        return respuesta;
    }
    fs.unlink(url, resultado);

}