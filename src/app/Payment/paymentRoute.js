module.exports = function(app){
    const payment = require('./paymentController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 결제수단 조회 API
    app.get('/app/users/:userId/payments', jwtMiddleware, payment.getPayments);
    
    // 결제수단(계좌이체) 추가 API
    app.post('/app/users/:userId/payment-banks', jwtMiddleware, payment.postPaymentBank);

    // 결제수단(계좌이체) 삭제 API
    app.patch('/app/users/:userId/payment-banks/:paymentBankId/status', jwtMiddleware, payment.patchPaymentBankStatus);

    // 결제수단(신용/체크) 추가 API
    app.post('/app/users/:userId/payment-cards', jwtMiddleware, payment.postPaymentCard);

    // 결제수단(신용/체크) 삭제 API
    app.patch('/app/users/:userId/payment-cards/:paymentCardId/status', jwtMiddleware, payment.patchPaymentCardStatus);
    
};