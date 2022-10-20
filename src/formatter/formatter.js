const { Log } = require('../models');
const { logMethods } = require('./log-methods');
const {
    getObjectType,
    isError
} = require('../utils');


const buildLog = (levels, level, filename, line) => {
    const objectType = getObjectType(levels[level]);
    const message = formatMessage(levels, level);
    const label = formatLabel(filename);
    return new Log(message, line, label, objectType);
};

const formatLabel = (filename) => {
    let parts = filename.split('/');
    return parts.length !== 1
        ? parts[parts.length - 2] + '/' + parts.pop()
        : filename;
};

const formatMessage = (levels, level) => {
    let message = levels[level];
    if (!isError(message)) {
        return logMethods[level](message);
    }
    return formatError(message).message;
};

/**
 *
 * @param message
 * @returns {{message: string}}
 */
const formatError = (message) => {
    const response = message;
    return {
        message: response.message
            ? response.message
            : JSON.stringify(response)
    };
};

module.exports = {
    buildLog
};
