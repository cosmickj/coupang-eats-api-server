const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);

  connection.release();
  return emailCheckResult;
};

exports.phoneNumberCheck = async function (phoneNumber) {
  const connection = await pool.getConnection(async (conn) => conn);
  const phoneNumberCheckResult = await userDao.selectUserPhoneNumber(connection, phoneNumber);

  connection.release();
  return phoneNumberCheckResult;
}

exports.signInCheck = async function (selectUserParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const signInCheckResult = await userDao.selectUserInfo(connection,selectUserParams);

  connection.release();
  return signInCheckResult[0];
};
