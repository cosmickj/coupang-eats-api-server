const jwtMiddleware = require("../../../config/jwtMiddleware");
const cartProvider = require("../../app/Cart/cartProvider");
const cartService = require("../../app/Cart/cartService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.getCart = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const cartListByUserIdResult = await cartProvider.retrieveCartListByUserId(userId);
    if (cartListByUserIdResult.length == 0)
        return res.send(response(baseResponse.SUCCESS, {"cartInfo":"장바구니가 비어있습니다."}))
        
    const destinationByUserIdResult = await cartProvider.retrieveDestinationByUserId(userId);
    const storeInCartResult = await cartProvider.retrieveStoreInCart(userId);

    let totalOrderPrice = 0
    for (let x of cartListByUserIdResult) {totalOrderPrice += x.price;}
    
    const selectCouponListParams = {
        totalOrderPrice,
        storeId : storeInCartResult[0].storeId,
        userId,
    };
    const couponListResult = await cartProvider.retrieveCouponListByParams(Object.values(selectCouponListParams));
    const paymentByUserId = await cartProvider.retrievePaymentByUserId(userId);
    
    const cartInfo = {
        destiantion : destinationByUserIdResult,
        store : storeInCartResult,
        selectedMenus : cartListByUserIdResult,
        coupons : couponListResult,
        payment : paymentByUserId,
    }
    return res.send(response(baseResponse.SUCCESS, cartInfo));
}

exports.postCart = async function (req, res) {
    const {storeId, menuId, amount, price, menuOptionIds} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const storeByUserIdResult = await cartProvider.retrieveStoreByUserId(userId);
    if (storeByUserIdResult.length == 0 || storeByUserIdResult[0].storeId == storeId) {
        const insertCartInfoParams = {
            userId,
            storeId,
            menuId,
            menuOptionIds,
            amount,
            price
        }

        const cartByParamsResult = await cartProvider.retrieveCartByParams(insertCartInfoParams);
        if (cartByParamsResult.length == 0) {
            // 카트에 선택 사항이 없음 -> 카트에 추가
            const addCartResponse = await cartService.createCart(Object.values(insertCartInfoParams));
            return res.send(addCartResponse);

        } else {
            // 카트에 선택 사항이 있음 -> 수량 증가
            const editCartInfoParams = {
                amount : insertCartInfoParams.amount + cartByParamsResult[0].amount,
                price  : (insertCartInfoParams.price / insertCartInfoParams.amount) * (insertCartInfoParams.amount + cartByParamsResult[0].amount),
                cartId : cartByParamsResult[0].cartId,
            }
            const editCartResponse = await cartService.editCart(Object.values(editCartInfoParams));
            return res.send(editCartResponse);
        }
    } else if(storeByUserIdResult[0].storeId != storeId) {
        // 카트에 들어있는 매장Id와 다른 Id가 들어왔을 때
        return res.send(response(baseResponse.CART_STOREID_UNMATCHED));
    }
}


exports.postCartRefresh = async function (req, res) {
    const {storeId, menuId, amount, price, menuOptionIds} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const storeByUserIdResult = await cartProvider.retrieveStoreByUserId(userId);
    if (storeByUserIdResult[0].storeId == storeId)
        return res.send(errResponse(baseResponse.CART_STOREID_MATCHED));

    // 기존에 카트에 담겨져 있던 메뉴의 상태를 모두 DELETE로 변경
    const removeCartListResponse = await cartService.removeCartList(userId);
    
    // 카트에 메뉴 새로 담기
    const insertCartInfoParams = {
        userId,
        storeId,
        menuId,
        menuOptionIds,
        amount,
        price
    }
    const addCartResponse = await cartService.createCart(Object.values(insertCartInfoParams));
    return res.send(addCartResponse);
}

/* /app/carts/users/:userId/orders */
exports.postOrders = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const {destinationId, couponId, subOrderFee, discountPrice, deliveryFee, totalOrderFee,
           toStore, needDisposable, toRider, paymentType, paymentId} = req.body;

    const insertOrdersInfoParams = [userId, destinationId, couponId, subOrderFee, discountPrice, deliveryFee, totalOrderFee,
                                    toStore, needDisposable, toRider, paymentType, paymentId];

    const addOrdersResponse = await cartService.createOrders(insertOrdersInfoParams);
    return res.send(addOrdersResponse);
};

/* /app/carts/users/:userId/orders/:orderHistoryId */
exports.getOrders = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const {userId, orderHistoryId} = req.params;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const orderHistoryResult = await cartProvider.retrieveOrderHistory(userId, orderHistoryId);
    const cartListByOrderHistoryId = await cartProvider.retrieveCartListByOrderHistoryId(orderHistoryId);
    orderHistoryResult[0]['menuOrdered'] = cartListByOrderHistoryId;
    return res.send(response(baseResponse.SUCCESS, orderHistoryResult));
}