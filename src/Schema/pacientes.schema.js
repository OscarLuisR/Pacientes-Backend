const { Schema } = require('mongoose');
const joi = require('joi');
const message = require('../libs/message');
const mongoosePaginate = require('mongoose-paginate-v2');

const pacienteSchema = new Schema (
    {
        nombre: {type: String, required: true, unique: true},
        dni: {type: String, required: true},
        direccion: {type: String, required: true},
        codigopostal: String,
        telefono: String,
        genero: String,
        correo: {type: String, required: true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

pacienteSchema.plugin(mongoosePaginate);

pacienteSchema.validaSchema = joi.object({
    nombre: joi.string()
        .trim()
        .required()
        .error(errors => {
            errors.forEach(err => {
                console.log(message.disconnected(err));
                console.log(message.disconnected(err.code));

                switch (err.code) {
                    case "any.required":  
                        err.message = "Debe ingresar un nombre";
                        break;
                    case "string.empty":
                        err.message = "Debe ingresar un nombre Valido";                                             
                        break;
                    default:
                        break;
                }
            });

            return errors;
        }),

    dni: joi.string()
        .trim()
        .required()
        .error(errors => {
            errors.forEach(err => {
                console.log(message.disconnected(err));
                console.log(message.disconnected(err.code));

                switch (err.code) {
                    case "any.required":
                        err.message = "Debe ingresar un dni";                        
                        break;
                    case "string.empty":                        
                        err.message = "Debe ingresar un dni Valido";                        
                        break;
                    default:
                        break;
                }
            });

            return errors;
        }),

    direccion: joi.string()
        .trim()
        .required()
        .error(errors => {
            errors.forEach(err => {
                console.log(message.disconnected(err));
                console.log(message.disconnected(err.code));

                switch (err.code) {
                    case "any.required":
                        err.message = "Debe ingresar una direccion";                        
                        break;
                    case "string.empty":                        
                        err.message = "Debe ingresar una direccion Valida";                        
                        break;
                    default:
                        break;
                }
            });

            return errors;
        }),
    
    correo: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
        .required()
        .error(errors => {
            errors.forEach(err => {
                console.log(message.disconnected(err));
                console.log(message.disconnected(err.code));

                switch (err.code) {
                    case "any.required":
                        err.message = "Debe ingresar un correo";                        
                        break;
                    case "string.empty":                        
                    case "string.email":
                        err.message = "Debe ingresar un correo Valido";                        
                        break;
                    default:
                        break;
                }
            });

            return errors;
        })
});

module.exports = pacienteSchema;