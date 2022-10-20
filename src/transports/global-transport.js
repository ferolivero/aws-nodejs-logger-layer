const Transport = require('winston-transport');
class GlobalTransport extends Transport {
    constructor(opts) {
        super(opts);
    }

    log(logMessage, callback) {
        setImmediate(() => {
            this.emit('logged', logMessage);
        });

        if (!global.winstonLogger) {
            global.winstonLogger = [logMessage];
        } else {
            global.winstonLogger.push(logMessage);
        }
        callback();
    }
}

module.exports = GlobalTransport;
