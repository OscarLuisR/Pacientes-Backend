// COPIAR ...
const jwt = require('jsonwebtoken');
const authSchema = require('../Schema/auth.schema');
const connAuth  = require('../database/dbAuth');

const verificaAuth = {};

verificaAuth.verificaDatosLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { error } = await authSchema.validaSchema.validate(req.body);

        if (error) {
            return res.json({ status: 400, error: true, message: error.details[0].message, results: "" });
        }

        // VERIFICAR SI EL EMAIL NO EXISTE EN LA BD
        const user = await connAuth.model('Users').findOne({ email: email }).populate({ path: 'rol', model: 'Roles' }).exec();

        if (!user) {
            return res.json({ status: 400, error: true, message: 'Acceso DENEGADO', results: "" });
        }

        // VERIFICAR SI EL PASSWORD INTRODUCIDO COINCIDE CON EL DE LA BD    
        const comparacion = await authSchema.compararPassword(password, user.password);

        if (!comparacion) {
            return res.json({ status: 400, error: true, message: 'Acceso DENEGADO', results: "" });
        }

        // VERIFICAR QUE POSEA UN ROL VALIDO
        if (!user.rol) {
            return res.json({ status: 400, error: true, message: 'Rol Invalido, Acceso DENEGADO', results: "" });
        }

        req._id = user._id;
        req.username = user.username;
        req.id_rol = user.rol._id;
        req.rol = user.rol.rol;
        
        next();

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

verificaAuth.verificaToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];

        // VALIDA QUE LE ENVIEN LA CABECERA
        if (!token) {
            return res.json({ status: 403, error: true, message: 'No Token Provided', results: "" });
        }

        // VALIDA QUE EL TOKEN SEA VALIDO
        const decoded = jwt.verify(token, process.env.SECRET);

        req._id = decoded._id;
        req.username = decoded.username;
        req.id_rol = decoded.id_rol;
        req.rol = decoded.rol;

        // VALIDA QUE EL USUARIO DEL TOKEN EXISTA
        const user = await connAuth.model('Users').findById(req._id, { password: false }).populate({ path: 'rol', model: 'Roles' }).exec();

        if (!user) {
            return res.json({ status: 404, error: true, message: 'Token Invalido', results: "" });
        }

        // VERIFICAR QUE POSEA UN ROL VALIDO
        if (!user.rol) {
            return res.json({ status: 400, error: true, message: 'Token Invalido', results: "" });
        }

        next();

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

verificaAuth.verificaPermisoAdmin = (req, res, next) => {
    if (!req.rol.includes("Admin")) {
        return res.json({ status: 404, error: true, message: 'Requiere Permiso de Administrador', results: "" });
    }

    next();
};

verificaAuth.verificaPermisoUser = (req, res, next) => {
    if (!req.rol.includes("Admin", "User")) {
        return res.json({ status: 404, error: true, message: 'Requiere Permiso de Usuario', results: "" });
    }

    next();
};

verificaAuth.verificaPermisoGuest = (req, res, next) => {
    if (!req.rol.includes("Admin", "User", "Guest")) {
        return res.json({ status: 404, error: true, message: 'Requiere Permiso de Invitado', results: "" });
    }
        
    next();
};

module.exports = verificaAuth;