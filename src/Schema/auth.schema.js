// COPIAR ...
const joi = require('joi');
const message = require('../libs/message');
const bcrypt = require('bcryptjs');

const authSchema = {};

authSchema.validaSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
        .required()
        .error(errors => {
            errors.forEach(err => {
                console.log(message.disconnected(err));
                console.log(message.disconnected(err.code));

                switch (err.code) {
                    case "any.required":
                        err.message = "Debe ingresar un Email";                        
                        break;
                    case "string.empty":                        
                    case "string.email":
                        err.message = "Debe ingresar un Email Valido";                        
                        break;
                    default:
                        break;
                }
            });

            return errors;
        }),

    password: joi.string()
        .min(5)
        .max(20)
        .required()
        .error(errors => {
            errors.forEach(err => {
                console.log(message.disconnected(err));
                console.log(message.disconnected(err.code));

                switch (err.code) {
                    case "any.required":
                        err.message = "Debe ingresar un Password";                        
                        break;
                    case "string.empty":
                    case "string.min":
                        err.message = "El Password debe tenaer un minimo de 5 carracteres";                        
                        break;
                    case "string.max":
                        err.message = "El Password debe tenaer un maximo de 20 carracteres";                        
                        break;
                    default:
                        break;
                }
            });

            return errors;
        })
});

authSchema.compararPassword = async (passwordRecibido, password) => {
    try {
        return await bcrypt.compare(passwordRecibido, password);    
    } catch (err) {
        console.log(err);
        return null;
    }    
};

module.exports = authSchema;