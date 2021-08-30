const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

exports.retrieveReviewListByStoreId = async function(storeId, isPhoto) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewListByStoreIdResult = await reviewDao.selectReviewListByStoreId(connection, storeId, isPhoto);

    connection.release();
    return reviewListByStoreIdResult;
}