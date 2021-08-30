const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const cartProvider = require("./cartProvider");
const cartDao = require("./cartDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");

exports.createCart = async function(insertCartInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const createCartResult = await cartDao.insertCartInfo(connection, insertCartInfoParams);
        return response(baseResponse.SUCCESS, {'cartId' : createCartResult.insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}

exports.editCart = async function(editCartInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const editCartResult = await cartDao.updateCartInfo(connection, editCartInfoParams);
        return response(baseResponse.SUCCESS, {'info':editCartResult.info});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }   
}

exports.removeCartList = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const removeCartListResult = await cartDao.deleteCartListStatus(connection, userId);
        return removeCartListResult;

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}

exports.createOrders = async function(insertOrdersInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const createOrdersResult = await cartDao.insertOrders(connection, insertOrdersInfoParams);

        const userId = insertOrdersInfoParams[0];
        const orderHistoryId = createOrdersResult.insertId;
        const editCartListStatusResult = await cartDao.editCartListStatus(connection, orderHistoryId, userId);

        return response(baseResponse.SUCCESS, {'orderHistoryId' : createOrdersResult.insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}