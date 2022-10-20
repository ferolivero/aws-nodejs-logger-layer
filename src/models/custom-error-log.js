class CustomErrorLog {
    constructor(message) {
        this.level = message.level;
        this.tag = message.name.toUpperCase();
        this.message = message.message;
        this.filename = '';
        if (message.code !== undefined) this.code = message.code;
        if (message.errorDesc !== undefined)
            this.errorDesc = message.errorDesc;
        if (message.stack !== undefined) this.stack = message.stack;
    }
}

module.exports = {
    CustomErrorLog
};
