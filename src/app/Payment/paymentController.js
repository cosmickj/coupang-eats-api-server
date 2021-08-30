const jwtMiddleware = require("../../../config/jwtMiddleware");
const paymentProvider = require("../../app/Payment/paymentProvider");
const paymentService = require("../../app/Payment/paymentService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/* [GET] /app/users/:userId/payments */
exports.getPayments = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const paymentListByUserIdResult = await paymentProvider.retrievePaymentByUserId(userId);
    return res.send(response(baseResponse.SUCCESS, paymentListByUserIdResult));
}

/* [POST] /app/users/:userId/payment-banks */
exports.postPaymentBank = async function (req, res) {
    const {brand, bankAccount, userName} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    
    // userId & userName 일치 여부
    const userNameByUserId = await paymentProvider.retrieveUserNameByUserId(userId);
    if (userName != userNameByUserId[0].name)
        return res.send(errResponse(baseResponse.BANK_ACCOUNT_HOST_UNMATCHED));

    // 계좌번호 중복 여부
    const paymentBankByParams = await paymentProvider.retrievePaymentBankByParams(brand, bankAccount);
    if (paymentBankByParams.length > 0)
        return res.send(errResponse(baseResponse.BANK_ACCOUNT_REDUNDANT));

    const insertPaymentBankInfoParams = [userId, brand, bankAccount, userName];
    const addPaymentBankResponse = await paymentService.createPaymentBank(insertPaymentBankInfoParams);
    return res.send(addPaymentBankResponse);
}

/* [PATCH] /app/users/:userId/payment-banks/:paymentBankId/status */
exports.patchPaymentBankStatus = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const {userId, paymentBankId} = req.params;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const bankStatusByParamsResult = await paymentProvider.retrieveBankStatusByParams(userId, paymentBankId);
    // 자신의 계좌만 삭제할 수 있어야한다.
    if (bankStatusByParamsResult.length == 0)
        return res.send(errResponse(baseResponse.BANK_PAYMENTBANKID_UNMATCHED));
    // 이미 삭제된 계좌를 삭제처리할 이유는 없다.
    if (bankStatusByParamsResult[0].status == 'DELETE')
        return res.send(errResponse(baseResponse.BANK_PAYMENTBANKID_NOT_EXIST))

    const removePaymentBankByIdResponse = await paymentService.removePaymentBankById(paymentBankId);
    return res.send(removePaymentBankByIdResponse);
}

/* [POST] /app/users/:userId/payment-cards */
exports.postPaymentCard = async function (req, res) {
    const {brand, cardName, cardNumber, expiryMonth, expiryYear, cvcNumber} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const insertPaymentCardInfoParams = [userId, brand, cardName, cardNumber, expiryMonth, expiryYear, cvcNumber];
    if (insertPaymentCardInfoParams.includes(''))
        return res.send(errResponse(baseResponse.CARD_BODY_INPUT_EMPTY))

    const regexCardNumber = /^\d{16}$/;
    if (!regexCardNumber.test(cardNumber))
        return res.send(errResponse(baseResponse.CARD_CARDNUMBER_ERROR_TYPE));

    const regexCvcNumber = /^\d{3}$/;
    if (!regexCvcNumber.test(cvcNumber))
        return res.send(errResponse(baseResponse.CARD_CVCNUMBER_ERROR_TYPE));

    const regexExpiry = /^\d{2}$/;
    if (!regexExpiry.test(expiryMonth) || !regexExpiry.test(expiryYear))
        return res.send(errResponse(baseResponse.CARD_EXPIRYDATE_ERROR_TYPE));
    
    // 신용/체크 카드 번호 중복 여부
    const paymentCardByNumber = await paymentProvider.retrievePaymentCardByNumber(cardNumber);
    if (paymentCardByNumber.length > 0)
        return res.send(errResponse(baseResponse.CARD_PAYMENT_REDUNDANT));

    const addPaymentCardResponse = await paymentService.createPaymentCard(insertPaymentCardInfoParams);
    return res.send(addPaymentCardResponse);
}

/* [PATCH] /app/users/:userId/payment-cards/:paymentCardId/status */
exports.patchPaymentCardStatus = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const {userId, paymentCardId} = req.params;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const cardStatusByParamsResult = await paymentProvider.retrieveCardStatusByParams(userId, paymentCardId);
    if (cardStatusByParamsResult.length == 0)
        return res.send(errResponse(baseResponse.CARD_PAYMENDCARDID_UNMATCHED));
    if (cardStatusByParamsResult[0].status == 'DELETE')
        return res.send(errResponse(baseResponse.CARD_PAYMENT_REDUNDANT));

    const removePaymentCardByIdResponse = await paymentService.removePaymentCardById(paymentCardId);
    return res.send(removePaymentCardByIdResponse);
}