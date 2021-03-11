const { Schema } = require('mongoose');

const roleSchema = new Schema (
    {
        rol: {type: String, required: true, unique: true}
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = roleSchema;
