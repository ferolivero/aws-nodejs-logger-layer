const logger = require('./logger');
const { formatter, availableLogMethods } = require('../formatter');

const getStack = (executionLevel) => {
    const _prepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const stack = new Error().stack.slice(1);
    Error.prepareStackTrace = _prepareStackTrace;
    return stack[executionLevel];
};

const getLogInfo = (previousLevel = 2, consolePadding = 8) => {
    const filename = getStack(previousLevel).getFileName();
    const line = getStack(previousLevel).getLineNumber();
    const column =
        getStack(previousLevel).getColumnNumber() - consolePadding;
    const lineAndCol = `${line}:${column}`;
    return { filename, line, column, lineAndCol };
};

class LoggerWrapper {
    /**
     *
     * @param {Module} callingModule Recibe un modulo, este lo va a usar para obtener el nombre del archivo.
     */
    constructor() {
        this.config = {
            logLevel: process.env.LOG_LEVEL || 'info'
        };
        this._checkLogLevel(availableLogMethods);
        this.line = '';
        this.logger = logger(this.config);
    }

    tracker({}) {}

    _validateMethod(level) {
        if (!availableLogMethods.includes(level))
            throw new Error(`Metodo ${level} no definido`);
    }

    /**
     *  @param levels Se admiten los siguientes niveles debug, info, error, warn Ej: {error: 'Mensaje de error'}
     *  otro tipo devuelve una exception.
     */
    log({ line, filename, ...levels }) {
        const logInfo = getLogInfo(2, 7);
        this.filename = filename || logInfo.filename;
        this.line = line || logInfo.lineAndCol;

        let levelsToLog = Object.keys(levels);
        levelsToLog.forEach((level) => {
            this._validateMethod(level);
            this.logger[level](
                formatter.buildLog(
                    levels,
                    level,
                    this.filename,
                    this.line
                )
            );
        });
    }

    _executeLog({ args, op, line, filename }) {
        const logInfo = getLogInfo(3, 7);
        args.forEach((arg) => {
            const infoToLog = {
                line: line || logInfo.lineAndCol,
                filename: filename || logInfo.filename
            };
            infoToLog[`${op}`] = arg;
            this.log(infoToLog);
        });
    }

    _customDebug({ args, filename, line }) {
        this._executeLog({ args, op: 'debug', filename, line });
    }

    _customInfo({ args, filename, line }) {
        this._executeLog({ args, op: 'info', filename, line });
    }

    _customError({ args, filename, line }) {
        this._executeLog({ args, op: 'error', filename, line });
    }

    _customWarn({ args, filename, line }) {
        this._executeLog({ args, op: 'warn', filename, line });
    }

    debug(...args) {
        this._executeLog({ args, op: 'debug' });
    }

    info(...args) {
        this._executeLog({ args, op: 'info' });
    }

    error(...args) {
        this._executeLog({ args, op: 'error' });
    }

    warn(...args) {
        this._executeLog({ args, op: 'warn' });
    }

    _checkLogLevel(levels) {
        if (levels.every((level) => level !== this.config.logLevel))
            throw new Error(
                `LOG_LEVEL ${this.logLevel} utilizar ${levels}`
            );
    }
}

module.exports = {
    Logger: LoggerWrapper,
    getLogInfo
};
