const conn = require('../database/db');

/*
const faker = require('faker');

let newPaciente;

for (let index = 1; index <= 250; index++) {
    newPaciente = new conn.model('Pacientes')({
        nombre: faker.name.firstName() + ' ' + faker.name.lastName(),
        dni: faker.finance.creditCardNumber(),
        direccion: faker.address.direction(),
        codigopostal: faker.address.zipCode(),
        telefono: faker.phone.phoneNumber(),
        genero: faker.name.gender(),
        correo: faker.internet.email()
    });    
    
    const results = await newPaciente.save();            
}

res.send('500 REGISTROS CREADOS');
*/

const pacienteCtrl = {};

pacienteCtrl.getPacientes = async (req, res) => {
    try {
        const { page, paginationMin, paginationMax } = req.query;
        
        let max = 0, min = 0;
        let pagination = [];
        
        let results = await conn.model('Pacientes').paginate({}, {select: '-createdAt -updatedAt', limit: 10, page});

        if (parseInt(paginationMin) > 0 && parseInt(paginationMax) > 0) {
            if ( results.totalPages <= 10 ){
                min = 1;
                max = results.totalPages;
            }else {
                if ( parseInt(page) >= parseInt(paginationMin) && parseInt(page) <= parseInt(paginationMax) ) {
                    min = parseInt(paginationMin);
                    max = parseInt(paginationMax);
                }else if (parseInt(page) > parseInt(paginationMax)) {
                    min = (parseInt(page) - 10 + 1);
                    max = parseInt(page);
                }else if (parseInt(page) < parseInt(paginationMin)) {
                    min = parseInt(page);
                    max = (parseInt(page) + 10) - 1;
                }
            }
            
            for (let index = min; index <= max; index++) {
                pagination.push(index);            
            }
        }
        
        let resultado = ({
            docs: results.docs,
            totalDocs: results.totalDocs,
            limit: results.limit,
            totalPages: results.totalPages,
            page: results.page,
            pagingCounter: results.pagingCounter,
            hasPrevPage: results.hasPrevPage,
            hasNextPage: results.hasNextPage,
            prevPage: results.prevPage,
            nextPage: results.nextPage,
            pagination: pagination
        });

        res.status(200).json({ status: 200, error: false, message: '', results: resultado});
        
    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

pacienteCtrl.getPacienteId = async (req, res) => {
    const { id } = req.params;

    try {
        const results = await conn.model('Pacientes').findById({_id: id}, {createdAt: 0, updatedAt: 0});

        res.status(200).json({ status: 200, error: false, message: '', results });

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

pacienteCtrl.createPaciente = async (req, res) => {
    try {
        console.log(req.body);
        
        const newPaciente = conn.model('Pacientes')(req.body);    

        const results = await newPaciente.save();
        
        res.status(200).json({ status: 200, error: false, message: '', results: {_id: results._id, name: results.name, position: results.position, office: results.office, salary: results.salary }});

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }    
};

pacienteCtrl.updatePaciente = async (req, res) => {
    const { id } = req.params;

    try {
        const results = await conn.model('Pacientes').findByIdAndUpdate({_id: id}, req.body, {new: true, fields: '-createdAt -updatedAt'});

        res.status(200).json({ status: 200, error: false, message: '', results});

    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

pacienteCtrl.deletePaciente = async (req, res) => {
    const { id } = req.params;

    try {        
        const results = await conn.model('Pacientes').findByIdAndDelete({_id: id});

        res.status(200).json({ status: 200, error: false, message: '', results});
        
    } catch (err) {
        return res.json({ status: 401, error: true, message: err.message, results: "" });
    }
};

module.exports = pacienteCtrl;