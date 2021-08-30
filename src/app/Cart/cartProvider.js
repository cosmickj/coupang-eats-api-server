const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const cartDao = require("./cartDao");

exports.retrieveDestinationByUserId = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const destinationByUserIdResult = await cartDao.selectDestinationByUserId(connection, userId);

    connection.release();
    return destinationByUserIdResult;
}

exports.retrieveStoreInCart = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeInCartResult = await cartDao.selectStoreInCart(connection, userId);

    connection.release();
    return storeInCartResult;
}

exports.retrieveCartListByUserId = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cartListResult = await cartDao.selectCartListByUserId(connection, userId);

    for (let i in cartListResult) {
        try {
            let menuOptionIds = cartListResult[i].menuOptionIds.split(',');
            const menuOptionDetail = []
            for (let j in menuOptionIds) {
                let menuOptionId = menuOptionIds[j];
                let menuOptionDetailResult = await cartDao.selectMenuOptionDetail(connection, menuOptionId);
                menuOptionDetail.push(menuOptionDetailResult[0].menuOptionDetail);
            }
            cartListResult[i]['menuOptionDetail'] = menuOptionDetail.join(', ');
        } catch {
            cartListResult[i]['menuOptionDetail'] = "";
        }
    }

    connection.release();
    return cartListResult;
}

exports.retrieveCouponListByParams = async function(selectCouponListParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const couponListResult = await cartDao.selectCouponListByParams(connection, selectCouponListParams);

    connection.release();
    return couponListResult;
}

exports.retrievePaymentByUserId = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const paymentByUserIdResult = await cartDao.selectPaymentByUserId(connection, userId);

    connection.release();
    return paymentByUserIdResult;
}

exports.retrieveStoreByUserId = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeResult = await cartDao.selectStoreByUserId(connection, userId);

    connection.release();
    return storeResult;
}

exports.retrieveCartByParams = async function(insertCartInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);

    insertCartInfoParams = Object.values(insertCartInfoParams)
    const cartResult = await cartDao.selectCartByParams(connection,insertCartInfoParams);
    
    connection.release();
    return cartResult;
}

exports.retrieveOrderHistory = async function(userId, orderHistoryId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const orderHistoryResult = await cartDao.selectOrderHistoryById(connection, userId, orderHistoryId);
    
    connection.release();
    return orderHistoryResult;
}

exports.retrieveCartListByOrderHistoryId = async function(orderHistoryId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const cartListByOrderHistoryIdResult = await cartDao.selectCartListByOrderHistoryId(connection, orderHistoryId);

    for (let x of cartListByOrderHistoryIdResult) {
        if (x.menuOptionIds == null || x.menuOptionIds == "") {
            x['menuOptionDetail'] = null;
        } else {
            let optionIds = x.menuOptionIds.split(',');
            const menuOptionDetail = []
            for (let y of optionIds) {
                let menuOptionDetailResult = await cartDao.selectMenuOptionDetail(connection, y);
                menuOptionDetail.push(menuOptionDetailResult[0].menuOptionDetail);
            }
            x['menuOptionDetail'] = menuOptionDetail.join(', ');
        }
    }
    
    connection.release();
    return cartListByOrderHistoryIdResult;
}
