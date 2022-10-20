const { createLogger, format, transports } = require('winston');
const { combine, printf } = format;
const { GlobalTransport } = require('../transports');

let customFormat = ({ level, message, timestamp }) => {
    const { messageToLog, line, label, objectType } = message;
    if (messageToLog && line && label && objectType) {
        const stackTrace = line ? `${label} ${line}` : label;
        return `${timestamp} ${level.toUpperCase()} [ ${stackTrace} | ${objectType} ]: ${messageToLog}`;
    }
    return `${timestamp} ${level.toUpperCase()}: ${message}`;
};

const myFormat = printf(customFormat);

module.exports = (config) => {
    let level = config.logLevel;
    let winstonTransports = [];

    const commonConfig = {
        level,
        handleExceptions: true,
        format: combine(
            format.timestamp({
                format: config.timestampFormat
            }),
            myFormat
        )
    };
    winstonTransports.push(
        new transports.Console({
            ...commonConfig,
            silent: process.env.NODE_ENV === 'test'
        })
    );

    if (process.env.NODE_ENV === 'test') {
        winstonTransports.push(new GlobalTransport(commonConfig));
    }

    return createLogger({
        level: config.logLevel,
        transports: winstonTransports,
        exitOnError: false
    });
};
