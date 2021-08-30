const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reviewProvider = require("./reviewProvider");
const reviewDao = require("./reviewDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");

exports.createreview = async function(insertreviewInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const createreviewResult = await reviewDao.insertreviewInfo(connection, insertreviewInfoParams);
        return response(baseResponse.SUCCESS, {'reviewId' : createreviewResult.insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);

    } finally {
        connection.release();
    }
}