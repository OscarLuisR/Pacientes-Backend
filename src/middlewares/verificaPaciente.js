const conn = require('../database/db');
const pacienteSchema = require('../Schema/pacientes.schema');

const verificaPaciente = {};

verificaPaciente.verificaParametrosPaginacion = async (req, res, next) => {
    let page = req.query.page;
    let paginationMin = req.query.paginationMin;
    let paginationMax = req.query.paginationMax;

    try {
        // SE VERIFICA SI SE INGRESO EL PARAMETRO PAGE
        if (page !== undefined) {
            // SE VERIFICA SI EL PARAMETRO PAGE ES UN NUMERO VALIDO
            if (isNaN(page) || page.length <= 0 ) {
                return res.json({ status: 400, error: true, message: 'El parametro Page debe ser un numero valido', results: "" });
            }

            // SE VERIFICA SI EL PARAMETRO PAGE ES UN NUMERO ENTERO MAYOR A CERO
            if (parseInt(page) <= 0) {
                return res.json({ status: 400, error: true, message: 'El parametro Page debe ser un numero entero mayor a Cero', results: "" });
            }
        }else {
            // SE COLOCA VALOR POR DEFECTO AL PARAMETRO PAGE
            page = 1;
        }

        // SE VERIFICA SI SE INGRESO EL PARAMETRO PAGINATION MIN (VALOR MINIMO DEL ARRAY DE PAGINACION)
        if (paginationMin !== undefined) {
            // SE VERIFICA SI EL PARAMETRO PAGINATION MIN ES UN NUMERO VALIDO
            if (isNaN(paginationMin) || paginationMin.length <= 0 ) {
                return res.json({ status: 400, error: true, message: 'El parametro Pagination Min debe ser un numero valido', results: "" });
            }

            // SE VERIFICA SI EL PARAMETRO PAGINATION MIN ES UN NUMERO ENTERO MAYOR A CERO
            if (parseInt(paginationMin) <= 0) {
                return res.json({ status: 400, error: true, message: 'El parametro Pagination Min debe ser un numero entero mayor a Cero', results: "" });
            }
        }else {
            // SE COLOCA VALOR POR DEFECTO AL PARAMETRO PAGINATION MIN
            paginationMin = 0;
        }

        // SE VERIFICA SI SE INGRESO EL PARAMETRO PAGINATION MAX (VALOR MAXIMO DEL ARRAY DE PAGINACION)
        if (paginationMax !== undefined) {
            // SE VERIFICA SI EL PARAMETRO PAGINATION MAX ES UN NUMERO VALIDO
            if (isNaN(paginationMax) || paginationMax.length <= 0 ) {
                return res.json({ status: 400, error: true, message: 'El parametro Pagination Max debe ser un numero valido', results: "" });
            }

            // SE VERIFICA SI EL PARAMETRO PAGINATION MAX ES UN NUMERO ENTERO MAYOR A CERO
            if (parseInt(paginationMax) <= 0) {
                return res.json({ status: 400, error: true, message: 'El parametro Pagination Max debe ser un numero entero mayor a Cero', results: "" });
            }
        }else {
            // SE COLOCA VALOR POR DEFECTO AL PARAMETRO PAGINATION MAX
            paginationMax = 0;
        }

        // SE VERIFICA QUE EL PARAMETRO PAGINATION MIN NO SEA MAYOR AL PARAMETRO PAGINATION MAX
        if (parseInt(paginationMin) > parseInt(paginationMax)) {
            return res.json({ status: 400, error: true, message: 'El parametro Pagination Min no puede ser mayor al parametro Pagination Max', results: "" });
        }

        // SE AGREGRAN LOS PARAMETROS COMO PROPIEDADES
        // req.query.limit = limit;
        req.query.page = page;
        req.query.paginationMin = paginationMin;
        req.query.paginationMax = paginationMax;
        
        next();

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

verificaPaciente.verificaDatosRegistroPaciente = async (req, res, next) => {
    const { nombre, dni, direccion, correo } = req.body;

    try {
        const { error } = await pacienteSchema.validaSchema.validate(req.body);

        if (error) {
            // VERIFICAR QUE CAMPOS SE INGRESARON PARA COMPROBAR SI YA EXISTEN EN LA BD
            if ((nombre !== undefined && error.details[0].context.key == 'nombre') || 
                (dni !== undefined && error.details[0].context.key == 'dni') || 
                (direccion !== undefined && error.details[0].context.key == 'direccion') ||
                (correo !== undefined && error.details[0].context.key == 'correo')) {
                    
                    return res.json({ status: 400, error: true, message: error.details[0].message, results: "" });            
            }
        }

        // VERIFICAR SI EL NOMBRE YA EXISTE EN LA BD
        const nameFind = await conn.model('Pacientes').findOne({ nombre: nombre });

        if (nameFind) {
            return res.json({ status: 400, error: true, message: 'Nombre Ya Existe' , results: "" });            
        }

        next();

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

verificaPaciente.verificaDatosUpdatePaciente = async (req, res, next) => {
    const { nombre, dni, direccion, correo } = req.body;
    const { id } = req.params;

    try {
        const { error } = await pacienteSchema.validaSchema.validate(req.body);

        if (error) {
            // VERIFICAR QUE CAMPOS SE INGRESARON PARA COMPROBAR SI YA EXISTEN EN LA BD
            if ((nombre !== undefined && error.details[0].context.key == 'nombre') || 
                (dni !== undefined && error.details[0].context.key == 'dni') || 
                (direccion !== undefined && error.details[0].context.key == 'direccion') ||
                (correo !== undefined && error.details[0].context.key == 'correo')) {
                    
                    return res.json({ status: 400, error: true, message: error.details[0].message, results: "" });            
            }
        }

        // SI SE INGRESO EL NAME SE VERIFICA SI YA EXISTE EN LA BD PARA OTRA PELICULA
        if (nombre !== undefined) {
            const nameFind = await conn.model('Pacientes').findOne({ nombre: nombre });

            if (nameFind) {
                if (id != nameFind._id) {
                    return res.json({ status: 400, error: true, message: 'Nombre Ya Existe' , results: "" });            
                }
            }
        }

        next();

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

module.exports = verificaPaciente;