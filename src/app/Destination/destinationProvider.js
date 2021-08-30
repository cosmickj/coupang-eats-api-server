const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const destinationDao = require("./destinationDao");

// exports.retrieveDestinationByUserId = async function(userId) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const destinationByUserIdResult = await destinationDao.selectDestinationByUserId(connection, userId);

//     connection.release();
//     return destinationByUserIdResult;
// }