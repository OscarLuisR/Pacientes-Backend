const { verificaDatosLogin, verificaToken, verificaPermisoAdmin, verificaPermisoUser, verificaPermisoGuest} = require('./verificaAuth');
const { verificaDatosRegistroPaciente, verificaDatosUpdatePaciente, verificaParametrosPaginacion } = require('./verificaPaciente');

module.exports = {
    verificaDatosLogin,
    verificaToken,
    verificaPermisoAdmin, 
    verificaPermisoUser,
    verificaPermisoGuest,
    verificaDatosRegistroPaciente, 
    verificaDatosUpdatePaciente,
    verificaParametrosPaginacion    
};