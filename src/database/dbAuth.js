const mongoose = require('mongoose');
const message = require('../libs/message');

let connAuth = null;

try {
    connAuth = mongoose.createConnection(`mongodb://${process.env.HOST}:${process.env.PORT_DB}/${process.env.DB_AUTH}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true 
    });

    connAuth.model('Users', require('../Schema/user.schema'));
    connAuth.model('Roles', require('../Schema/role.schema'));

    console.log(message.okAuth(` Conectado a la Base de Datos ${process.env.DB_AUTH} `));

    } catch (error) {
        console.log(message.error(` Error: ${error} `));
}

module.exports = connAuth;