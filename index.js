const { overwriteSystemLogs } = require('./src/functions');
const { Logger } = require('./src/core/logger-wrapper');

module.exports = {
    logger: new Logger(),
    overwriteSystemLogs
};
