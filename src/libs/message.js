const chalk = require('chalk');

const message = {};

message.connected = chalk.inverse.hex('#64DD17');
message.error = chalk.inverse.redBright;
message.ok = chalk.inverse.hex('#29B6F6');
message.okAuth = chalk.inverse.hex('#B388FF');
message.disconnected = chalk.inverse.hex('#FFEA00');
message.createRol = chalk.bold.hex('#D81B60');
message.createUser = chalk.bold.hex('#F4511E');

module.exports = message;