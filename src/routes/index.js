const  routes = require('express').Router();

routes.use('/api/auth', require('./auth.routes'));
routes.use('/api/pacientes', require('./pacientes.routes'));

module.exports = routes;