const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const destinationProvider = require("./destinationProvider");
const destinationDao = require("./destinationDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");

exports.createDestination = async function(insertDestinationInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const createDestinationResult = await destinationDao.insertDestinationInfo(connection, insertDestinationInfoParams);
        return response(baseResponse.SUCCESS, {'destinationId' : createDestinationResult.insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
};

exports.editDestination = async function(editDestinationResponse) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const editDestinationResult = await destinationDao.updateDestinationInfo(connection, editDestinationResponse);
        return response(baseResponse.SUCCESS, {'info' : editDestinationResult.info});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
};

exports.removeDestination = async function(destinationId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const removeDestinationResult = await destinationDao.updateDestinationStatus(connection, destinationId);
        return response(baseResponse.SUCCESS, {'info' : removeDestinationResult.info});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
};