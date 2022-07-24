const path = require('path');
const mime = require('mime');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tipo = req.params.tipoDocumento;
        let ruta = path.join(__dirname, `./../../uploads/${req.params.tipoDocumento}/`);
        cb(null, ruta);
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        ext = ext.length > 1 ? ext : '.' + mime.extension(file.mimetype);
        const nombre = Date.now() + ext;
        req.nombreDocumento = nombre; // <= aqui estamos seteando un campo en nuestro objeto request
        // Nótese que he escogido un nombre cualquiera para el campo, en este caso 'file_name'
        // Para usarlo debemos acceder usando este mismo nombre, como se verá mas adelante
        cb(null, nombre);
    }
});

const upload = multer({ storage: storage }).single('file');

module.exports = upload;
