class Log {
    constructor(message, line, label, objectType) {
        this.messageToLog = message;
        this.line = line;
        this.label = label;
        this.objectType = objectType;
    }
}

module.exports = {
    Log
};
