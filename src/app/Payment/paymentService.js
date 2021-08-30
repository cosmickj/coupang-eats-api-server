const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const paymentProvider = require("./paymentProvider");
const paymentDao = require("./paymentDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");

exports.createPaymentBank = async function(insertPaymentBankInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const createPaymentBankResult = await paymentDao.insertPaymentBankInfo(connection, insertPaymentBankInfoParams);
        return response(baseResponse.SUCCESS, {'paymentBankId':createPaymentBankResult.insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}

exports.removePaymentBankById = async function(paymentBankId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const removePaymentBankByIdResult = await paymentDao.deletePaymentBankById(connection, paymentBankId);
        return response(baseResponse.SUCCESS, {'info': removePaymentBankByIdResult.info});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}

exports.createPaymentCard = async function(insertPaymentCardInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const createPaymentCardResult = await paymentDao.insertPaymentCardInfo(connection, insertPaymentCardInfoParams);
        return response(baseResponse.SUCCESS, {'paymentCardId':createPaymentCardResult.insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}

exports.removePaymentCardById = async function(paymentCardId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const removePaymentCardByIdResult = await paymentDao.deletePaymentCardById(connection, paymentCardId);
        return response(baseResponse.SUCCESS, {'info': removePaymentCardByIdResult.info});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}