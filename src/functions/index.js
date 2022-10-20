const { Logger, getLogInfo } = require('../core/logger-wrapper');

/**
 * This function overwrite and add the logger methods to the native node console
 */
const overwriteSystemLogs = () => {
    var consoleHandler = console;
    consoleHandler.log = (...info) => {
        const logInfo = getLogInfo(2, 8);
        const logger = new Logger();
        logger._customInfo({
            line: logInfo.lineAndCol,
            args: info,
            filename: logInfo.filename
        });
    };
    consoleHandler.debug = (...info) => {
        const logInfo = getLogInfo(2, 8);
        const logger = new Logger();
        logger._customDebug({
            line: logInfo.lineAndCol,
            args: info,
            filename: logInfo.filename
        });
    };
    consoleHandler.error = (...info) => {
        const logInfo = getLogInfo(2, 8);
        const logger = new Logger();
        logger._customError({
            line: `${logInfo.line}:${logInfo.column}`,
            args: info,
            filename: logInfo.filename
        });
    };
    consoleHandler.info = (...info) => {
        const logInfo = getLogInfo(2, 8);
        const logger = new Logger();
        logger._customInfo({
            line: `${logInfo.line}:${logInfo.column}`,
            args: info,
            filename: logInfo.filename
        });
    };
    consoleHandler.warn = (...info) => {
        const logInfo = getLogInfo(2, 8);
        const logger = new Logger();
        logger._customWarn({
            line: `${logInfo.line}:${logInfo.column}`,
            args: info,
            filename: logInfo.filename
        });
    };
    consoleHandler.custom = (info) => {
        const logInfo = getLogInfo(2, 8);
        const logger = new Logger();
        Object.assign(info, {
            line: `${logInfo.line}:${logInfo.column}`,
            filename: logInfo.filename
        });
        logger.log(info);
    };
};

module.exports = {
    overwriteSystemLogs
};
