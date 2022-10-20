'use strict';

const env = Object.assign({}, process.env);
const chai = require('chai');
const { expect } = chai;
const { logger, overwriteSystemLogs } = require('./../../');
// To test overwrite native functions
overwriteSystemLogs();

describe('[LOGGER] test', () => {
    beforeEach(() => {
        process.env = Object.assign({}, env);
        global.winstonLogger = [];
    });

    it('Testing logger levels', async () => {
        logger.log({
            info: 'Info log',
            debug: { objectKey: 'object message' },
            error: new Error('Error message'),
            warn: ['new', 'warning', 'message']
        });
        const content = global.winstonLogger;
        expect(content[0].message.messageToLog).to.eql('Info log');
        expect(content[0].message.objectType).to.eql('string');
        expect(content[0].level).to.eql('info');

        expect(content[1].message.messageToLog).to.eql(
            '{"objectKey":"object message"}'
        );
        expect(content[1].message.objectType).to.eql('object');
        expect(content[1].level).to.eql('debug');

        expect(content[2].message.messageToLog).to.eql(
            'Error message'
        );
        expect(content[2].message.objectType).to.eql('error');
        expect(content[2].level).to.eql('error');

        expect(content[3].message.messageToLog).to.eql(
            '["new","warning","message"]'
        );
        expect(content[3].message.objectType).to.eql('array');
        expect(content[3].level).to.eql('warn');
    });

    it('Testing logger levels using overwrite opcion', async () => {
        console.custom({
            info: 'Info log',
            debug: { objectKey: 'object message' },
            error: new Error('Error message'),
            warn: ['new', 'warning', 'message']
        });
        const content = global.winstonLogger;
        expect(content[0].message.messageToLog).to.eql('Info log');
        expect(content[0].message.objectType).to.eql('string');
        expect(content[0].level).to.eql('info');

        expect(content[1].message.messageToLog).to.eql(
            '{"objectKey":"object message"}'
        );
        expect(content[1].message.objectType).to.eql('object');
        expect(content[1].level).to.eql('debug');

        expect(content[2].message.messageToLog).to.eql(
            'Error message'
        );
        expect(content[2].message.objectType).to.eql('error');
        expect(content[2].level).to.eql('error');

        expect(content[3].message.messageToLog).to.eql(
            '["new","warning","message"]'
        );
        expect(content[3].message.objectType).to.eql('array');
        expect(content[3].level).to.eql('warn');
    });

    it('Testing with level info with object', async () => {
        let obj = {};
        obj.a = 1;
        logger.log({
            debug: obj
        });
        const content = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        expect(content.a).to.eql(1);
    });

    it('Testing with level info with object and without line', async () => {
        let obj = {};
        obj.a = 1;
        logger.log({
            debug: obj
        });
        const content = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        expect(content.a).to.eql(1);
    });

    it('Testing with level debug without object', async () => {
        logger.log({
            debug: 1
        });
        const content = global.winstonLogger[0];
        const message = JSON.parse(content.message.messageToLog);
        const level = content.level;
        expect(message).to.eql(1);
        expect(level).to.eql('debug');
    });

    it('Testing with level debug without object using overwrite opcion', async () => {
        console.debug(1);
        const content = global.winstonLogger[0];
        const message = JSON.parse(content.message.messageToLog);
        const level = content.level;
        expect(message).to.eql(1);
        expect(level).to.eql('debug');
    });

    it('Testing with level debug with object', async () => {
        let obj = {
            a: 1
        };
        logger.debug(obj);
        const content = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        const level = global.winstonLogger[0]['level'];
        expect(content.a).to.eql(1);
        expect(level).to.eql('debug');
    });

    it('Testing with level debug with two or more objects', async () => {
        let obj = {
            a: 1
        };
        let obj2 = 'asd';
        logger.debug(obj, obj2);
        const content = [];
        const level = global.winstonLogger[0]['level'];
        global.winstonLogger.forEach((element) => {
            content.push(JSON.parse(element.message.messageToLog));
        });
        expect(content[0].a).to.eql(1);
        expect(content[1]).to.eql('asd');
        expect(level).to.eql('debug');
    });

    it('Testing with level info without object and without line', async () => {
        logger.log({
            debug: 1
        });
        const content = global.winstonLogger[0];
        const message = JSON.parse(content.message.messageToLog);
        const level = content.level;
        expect(message).to.eql(1);
        expect(level).to.eql('debug');
    });

    it('Testing with warn level with object', async () => {
        let obj = {
            a: 1
        };
        logger.warn(obj);
        const content = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        const level = global.winstonLogger[0]['level'];
        expect(content.a).to.eql(1);
        expect(level).to.eql('warn');
    });

    it('Testing with warn level with two or more objects', async () => {
        let obj = { a: 1 };
        let obj2 = 'asd';
        logger.warn(obj, obj2);
        const level = global.winstonLogger[0]['level'];
        const content1 = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        const content2 = global.winstonLogger[1].message.messageToLog;
        expect(content1.a).to.eql(1);
        expect(content2).to.eql('asd');
        expect(level).to.eql('warn');
    });

    it('Testing with error level with object', async () => {
        let obj = {
            a: 1
        };
        logger.error(obj);
        const content = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        const level = global.winstonLogger[0]['level'];
        expect(content.a).to.eql(1);
        expect(level).to.eql('error');
    });

    it('Testing with error level with object and overwrite native system log', async () => {
        let obj = {
            a: 1
        };
        console.error(obj);
        const content = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        const level = global.winstonLogger[0]['level'];
        expect(content.a).to.eql(1);
        expect(level).to.eql('error');
    });

    it('Testing with error level with two or more objects', async () => {
        let obj = {
            a: 1
        };
        let obj2 = 'asd';
        logger.error(obj, obj2);
        const content = [];
        const level = global.winstonLogger[0]['level'];
        global.winstonLogger.forEach((element) => {
            content.push(JSON.parse(element.message.messageToLog));
        });
        expect(content[0].a).to.eql(1);
        expect(content[1]).to.eql('asd');
        expect(level).to.eql('error');
    });

    it('Testing with level warn without object using overwrite opcion', async () => {
        console.warn(1);
        const content = global.winstonLogger[0];
        const message = JSON.parse(content.message.messageToLog);
        const level = content.level;
        expect(message).to.eql(1);
        expect(level).to.eql('warn');
    });

    it('Testing with level info without object using overwrite opcion', async () => {
        console.info(1);
        const content = global.winstonLogger[0];
        const message = JSON.parse(content.message.messageToLog);
        const level = content.level;
        expect(message).to.eql(1);
        expect(level).to.eql('info');
    });

    it('Testing with info level with object', async () => {
        let obj = {
            a: 1
        };
        logger.info(obj);
        const content = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        const level = global.winstonLogger[0]['level'];
        expect(content.a).to.eql(1);
        expect(level).to.eql('info');
    });

    it('Testing with info level with two or more objects', async () => {
        let obj = {
            a: 1
        };
        let obj2 = 'asd';
        logger.info(obj, obj2);
        const level = global.winstonLogger[0]['level'];
        const content1 = JSON.parse(
            global.winstonLogger[0].message.messageToLog
        );
        const content2 = global.winstonLogger[1].message.messageToLog;
        expect(content1.a).to.eql(1);
        expect(content2).to.eql('asd');
        expect(level).to.eql('info');
    });

    it('Testing fail - log level is wrong', async () => {
        try {
            process.env.LOG_LEVEL = 'undefined';
            const { logger } = require('./../../index');
            logger.log({
                unknown: 1
            });
        } catch (err) {
            expect(err).to.have.property('message');
            expect(err).to.have.property('stack');
            expect(err.message).eql('Metodo unknown no definido');
            expect(err).to.instanceOf(Error);
        }
    });

    it('Testing exception error', async () => {
        let user = {};
        user['a'] = 1;
        const err = {
            statusCode: 500,
            message: 'NullPointer Exception',
            logMessage:
                'NullPointerException at Logging NullPointer Exception'
        };
        logger.log({
            error: err
        });
        let content = global.winstonLogger[0];
        const { message, level } = content;
        const messageToLog = JSON.parse(message.messageToLog);
        expect(messageToLog.statusCode).to.eql(500);
        expect(messageToLog.message).to.eql('NullPointer Exception');
        expect(messageToLog.logMessage).to.eql(
            'NullPointerException at Logging NullPointer Exception'
        );
        expect(level).to.eql('error');
    });

    it('Testing fail because level not exist', async () => {
        try {
            logger.log({
                prueba: 1
            });
        } catch (err) {
            expect(err).to.instanceOf(Error);
        }
    });

    it('Testing default log info', async () => {
        process.env.LOG_LEVEL = null;
        const { Logger } = require('../../src/core/logger-wrapper');
        const otherInstanceLogger = new Logger();
        otherInstanceLogger.log({
            info: 'Info log',
            debug: { objectKey: 'object message' },
            error: new Error('Error message'),
            warn: ['new', 'warning', 'message']
        });
        const content = global.winstonLogger;
        expect(content.length).eql(3);
        expect(content[0].message.messageToLog).to.eql('Info log');
        expect(content[0].message.objectType).to.eql('string');
        expect(content[0].level).to.eql('info');

        expect(content[1].message.messageToLog).to.eql(
            'Error message'
        );
        expect(content[1].message.objectType).to.eql('error');
        expect(content[1].level).to.eql('error');

        expect(content[2].message.messageToLog).to.eql(
            '["new","warning","message"]'
        );
        expect(content[2].message.objectType).to.eql('array');
        expect(content[2].level).to.eql('warn');
    });
});
