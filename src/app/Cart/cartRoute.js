module.exports = function(app){
    const cart = require('./cartController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 카트 조회 API
    app.get('/app/carts/users/:userId', jwtMiddleware, cart.getCart);

    // 카트 담기 API
    app.post('/app/carts/users/:userId',jwtMiddleware, cart.postCart);

    // 카트 새로 담기 API
    app.post('/app/carts/users/:userId/refresh', jwtMiddleware, cart.postCartRefresh);

    // 주문하기 API
    app.post('/app/carts/users/:userId/orders', jwtMiddleware, cart.postOrders);

    // 주문내역 조회 API
    app.get('/app/carts/users/:userId/orders/:orderHistoryId', jwtMiddleware, cart.getOrders)

};