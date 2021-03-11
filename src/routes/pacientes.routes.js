const router = require('express').Router();
const pacienteCtrl = require('../controllers/Pacientes.controller');
const { verificaToken, verificaPermisoAdmin, verificaParametrosPaginacion, verificaDatosRegistroPaciente, verificaDatosUpdatePaciente } = require('../middlewares/index');

router.get('/', [verificaToken, verificaPermisoAdmin, verificaParametrosPaginacion], pacienteCtrl.getPacientes);
router.get('/:id', [verificaToken, verificaPermisoAdmin], pacienteCtrl.getPacienteId);
router.post('/', [verificaToken, verificaPermisoAdmin, verificaDatosRegistroPaciente], pacienteCtrl.createPaciente);
router.put('/:id', [verificaToken, verificaPermisoAdmin, verificaDatosUpdatePaciente], pacienteCtrl.updatePaciente);
router.delete('/:id', [verificaToken, verificaPermisoAdmin], pacienteCtrl.deletePaciente);

module.exports = router;