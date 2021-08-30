const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const paymentDao = require("./paymentDao");

exports.retrievePaymentByUserId = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const paymentListByUserIdResult = await paymentDao.selectPaymentListByUserId(connection, userId);

    connection.release();
    return paymentListByUserIdResult;
}

exports.retrieveUserNameByUserId = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userNameByUserIdResult = await paymentDao.selectUserNameByUserId(connection, userId);

    connection.release();
    return userNameByUserIdResult;
}

exports.retrievePaymentBankByParams = async function(brand, bankAccount) {
    const connection = await pool.getConnection(async (conn) => conn);
    const paymentBankByParamsResult = await paymentDao.selectPaymentBankByParams(connection, brand, bankAccount);

    connection.release();
    return paymentBankByParamsResult;
}

exports.retrieveBankStatusByParams =async function(userId, paymentBankId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const bankStatusByParamsResult = await paymentDao.selectPaymentBankByParams(connection, userId, paymentBankId);

    connection.release();
    return bankStatusByParamsResult;
}

exports.retrievePaymentCardByNumber = async function(cardNumber) {
    const connection = await pool.getConnection(async (conn) => conn);
    const paymentCardByNumberResult = await paymentDao.selectPaymentCardByNumber(connection, cardNumber);

    connection.release();
    return paymentCardByNumberResult;
}

exports.retrieveCardStatusByParams = async function(userId, paymentCardId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cardStatusByParamsResult = await paymentDao.selectPaymentCardByParams(connection, userId, paymentCardId);

    connection.release();
    return cardStatusByParamsResult;
}