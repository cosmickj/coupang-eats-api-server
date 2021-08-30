const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const {connect} = require("http2");

exports.createUser = async function (insertUserInfoParams) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(insertUserInfoParams.email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 휴대폰 번호 중복 확인
        const phoneNumberRows = await userProvider.phoneNumberCheck(insertUserInfoParams.phoneNumber);
        if (phoneNumberRows.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONE_NUMBER, {'email': phoneNumberRows[0].email} );
        };

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(insertUserInfoParams.password)
            .digest("hex");

        const connection = await pool.getConnection(async (conn) => conn);

        insertUserInfoParams.password = hashedPassword;
        insertUserInfoParams = Object.values(insertUserInfoParams);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        
        connection.release();
        return response(baseResponse.SUCCESS, {'userId':userIdResult[0].insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postSignIn = async function (email, password) {
    try {
        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserParams = [email, hashedPassword];
        const signInRows = await userProvider.signInCheck(selectUserParams);
        
        if (signInRows.length < 1)
            return errResponse(baseResponse.SIGNIN_INFORMATION_WRONG);

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: signInRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "1d",
                subject: "user",
            } // 유효 기간 1 day
        );

        return response(baseResponse.SUCCESS, {'userId': signInRows[0].userId, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// exports.editUser = async function (id, nickname) {
//     try {
//         console.log(id)
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
//         connection.release();

//         return response(baseResponse.SUCCESS);

//     } catch (err) {
//         logger.error(`App - editUser Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }