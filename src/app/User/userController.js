const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const regexPassword = /((?=.*[a-zA-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])|(?=.*[a-zA-z])(?=.*[0-9])|(?=.*[a-zA-z])(?=.*[!@#\$%\^&\*])|(?=.*[0-9])(?=.*[!@#\$%\^&\*]))(?=.{8,20})/;
// const {emit} = require("nodemon");

/**
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 * body: email, password, name, phoneNumber
 */
exports.postUsers = async function (req, res) {
    const {email, password, name, phoneNumber} = req.body;

    // 이메일 validation
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 비밀번호 validation
    if (! password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (email.split('@')[0] == password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_2));
    if (! regexPassword.test(password))
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_1));

    // 이름 validation
    if (! name)
        return res.send(response(baseResponse.SIGNUP_NAME_EMPTY));

    // 휴대폰 번호 validation
    if (! phoneNumber)
        return res.send(response(baseResponse.SIGNUP_PHONE_NUMBER_EMPTY));
    if (phoneNumber.length > 11||phoneNumber.length < 11)
        return res.send(response(baseResponse.SIGNUP_PHONE_NUMBER_LENGTH));

    const insertUserInfoParams = {
        email,
        password,
        name,
        phoneNumber
    };

    const signUpResponse = await userService.createUser(insertUserInfoParams);
    return res.send(signUpResponse);
};

/**
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {
    const {email, password} = req.body;

    // 이메일 validation
    if (!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));

    // 비밀번호 validation
    if (! password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};

/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
