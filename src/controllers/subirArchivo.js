const multer = require('multer');

// Subir foto de perfil
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'archivos');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

exports.upload = upload.single('foto');