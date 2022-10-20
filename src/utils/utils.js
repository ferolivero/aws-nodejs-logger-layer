const getObjectType = (obj) => {
    return {}.toString
        .call(obj)
        .match(/\s([a-z|A-Z]+)/)[1]
        .toLowerCase();
};

/**
 *
 * @param {String} message Devuelve si el parametro recibido es un error.
 */
const isError = (message) => {
    return message instanceof Error;
};

module.exports = {
    getObjectType,
    isError
};
