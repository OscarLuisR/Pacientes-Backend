const connAuth = require("../database/dbAuth");
const userSchema = require('../Schema/user.schema');
const message = require('../libs/message');

const InitialSetup = {};

InitialSetup.createRolUserAdmin = async () => {
    try {
        let id_rol;

        // Verifica si existe el Rol de Administrdor
        const rolFind = await connAuth.model('Roles').findOne({ rol: 'Admin' });

        // Si existe toma el campo id_rol
        if (rolFind) {   
            id_rol = rolFind._id;         
        }else {
            // const newRole = new roleModel({rol: 'Admin'});
            const newRole = connAuth.model('Roles')({rol: 'Admin'});

            // Si NO existe, crea el registro en la tabla
            const role = await newRole.save();

            if (!role) {
                return;
            }

            // Obtiene el campo id_rol
            id_rol = role._id;

            console.log(message.createRol('ROL ADMINISTRADOR CREADO..!'));
        }

        // Verifica si existe el Usuario Administrdor
        const userFind = await connAuth.model('Users').findOne({ email: 'admin@admin.com' }, {password: false});

        if (!userFind) {
            const newUsuario = connAuth.model('Users')({
                username: "Admin",
                email: "admin@admin.com",
                password: await userSchema.encriptarPassword('admin'),
                rol: id_rol
            });
    
            const user = await newUsuario.save();

            if (!user) {
                return;                
            }

            console.log(message.createUser('USUARIO ADMINISTRADOR CREADO..!'));
        }
        
    } catch (err) {
        console.log(message.error(` Error: ${err} `));
    }
};

module.exports = InitialSetup;