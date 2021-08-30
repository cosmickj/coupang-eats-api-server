async function selectDestinationByUserId(connection, userId) {
    const selectDestinationByUserIdQuery = `
    SELECT
        destinationId,
        (CASE
            WHEN type = 'HOME' THEN '집'
            WHEN type = 'COMPANY' THEN '회사'
            WHEN ( type = 'ETC' AND name IS NULL ) THEN address
            WHEN ( type = 'ETC' AND name IS NOT NULL ) THEN name
        END ) AS destinationName,
        CONCAT(streetAddress, IFNULL(addressDetail, ""), IFNULL(addressDirection, "")) AS fullAddress
    FROM destination
    WHERE destinationId = (SELECT destinationId FROM user WHERE  userId = ?);
    `;
    const [destinationByUserIdRows] = await connection.query(selectDestinationByUserIdQuery, userId);
    return destinationByUserIdRows;
}

async function selectStoreInCart(connection, userId) {
    const selectStoreInCartQuery = `
    SELECT
        storeId,
        name,
        cheetahDelivery,
        minimumOrderPrice,
        freeDeliveryPrice,
        deliveryFeeHigh,
        deliveryFeeLow
    FROM store 
    WHERE storeId = (SELECT DISTINCT(storeId) FROM cart WHERE userId = ? AND status = 'ACTIVE');
    `;
    const [storeInCartRows] = await connection.query(selectStoreInCartQuery, userId);
    return storeInCartRows;
}

async function selectCartListByUserId(connection, userId) {
    const selectCartListByUserIdQuery = `
    SELECT
        cart.menuId,
        menu.name,
        cart.price,
        cart.amount,
        cart.menuOptionIds
    FROM cart
    INNER JOIN menu ON menu.menuId = cart.menuId
    WHERE cart.userId = ? AND cart.status = 'ACTIVE'
    ORDER BY cart.createdAt;
    `;
    const [cartListByUserIdRows] = await connection.query(selectCartListByUserIdQuery, userId);
    return cartListByUserIdRows;
}

async function selectMenuOptionDetail(connection, menuOptionId) {
    const selectMenuOptionDetailQuery = `
    SELECT 
        (CASE
            WHEN price = 0 THEN content
            ELSE CONCAT(content, '(+', price, '원)')
        END)  AS menuOptionDetail
    FROM menuOption 
    WHERE menuOptionId = ?;
    `;
    const [menuOptionDetailRows] = await connection.query(selectMenuOptionDetailQuery, menuOptionId);
    return menuOptionDetailRows;
}

async function selectCouponListByParams(connection, selectCouponListParams) {
    const selectCouponListByParamsQuery = `
    SELECT
        c.couponId,
        c.title,
        c.discountPrice,
        c.minimumOrderPrice,
        c.expiryDate,
        (CASE
            WHEN c.minimumOrderPrice <= ? AND c.storeId = ? THEN "Y"
            ELSE "N"
        END) AS isAvailable
    FROM couponUserRelation cur
    INNER JOIN coupon c ON c.couponId = cur.couponId
    WHERE 
        cur.userId = ?
        AND c.status = 'ACTIVE';
    `;
    const [couponListByParamsRows] = await connection.query(selectCouponListByParamsQuery, selectCouponListParams);
    return couponListByParamsRows;
}

async function selectPaymentByUserId(connection, userId) {
    const selectPaymentByUserIdQuery = `
    SELECT
        "card" AS paymendType,
        pc.paymentCardId AS paymentId,
        pc.cardName AS paymentName,
        CONCAT('****',SUBSTR(pc.cardNumber,13,3),'*') AS paymentNumber
    FROM user u 
        RIGHT JOIN paymentCard pc ON pc.userId = u.userId
    WHERE u.userId = ${userId}
    UNION SELECT
        "bank" AS paymendType,
        pb.paymentBankId,
        pb.brand,
        CONCAT("****",RIGHT(pb.bankAccount,4)) AS paymentNumber
    FROM user u 
        RIGHT JOIN paymentBank pb ON pb.userId = u.userId
    WHERE u.userId = ${userId}
    ORDER BY RAND() LIMIT 1;
    `;
    const [paymentByUserIdRows] = await connection.query(selectPaymentByUserIdQuery, userId);
    return paymentByUserIdRows;
}

async function selectStoreByUserId(connection, userId) {
    const selectStoreByUserIdQuery = `
    SELECT
        DISTINCT( storeId )
    FROM cart
    WHERE
        userId = ?
        AND status = 'ACTIVE'; 
    `;
    const [storeByUserIdRows] = await connection.query(selectStoreByUserIdQuery, userId);
    return storeByUserIdRows;
}

async function selectCartByParams(connection, insertCartInfoParams) {
    let selectCartByParamsQuery = `
    SELECT 
        cartId, amount
    FROM cart
    WHERE 
        userId = ?
        AND storeId = ?
        AND menuId = ?
        AND status = 'ACTIVE'
    `;
    if (insertCartInfoParams[3] == null){
        selectCartByParamsQuery += `AND menuOptionIds IS NULL;`
    } else {
        selectCartByParamsQuery += "AND menuOptionIds = ?;"
    }
    const [cartByParamsRows] = await connection.query(selectCartByParamsQuery,insertCartInfoParams);
    return cartByParamsRows;
}

async function insertCartInfo(connection, insertCartInfoParams) {
    const insertCartInfoQeury = `
    INSERT INTO cart (userId, storeId, menuId, menuOptionIds, amount, price)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [insertCartInfoRows] = await connection.query(insertCartInfoQeury, insertCartInfoParams);
    return insertCartInfoRows;
}

async function updateCartInfo(connection, editCartInfoParams) {
    const updateCartInfoQuery = `
    UPDATE cart
    SET amount = ?, price = ?
    WHERE cartId = ?;
    `;
    const [updateCartInfoRows] = await connection.query(updateCartInfoQuery, editCartInfoParams);
    return updateCartInfoRows
}

async function deleteCartListStatus(connection, userId) {
    const deleteCartListStatusQuery = `
    UPDATE cart
    SET status = 'DELETE'
    WHERE userId = ? AND status = 'ACTIVE';
    `;
    const [deleteCartListStatusRows] = await connection.query(deleteCartListStatusQuery, userId);
    return deleteCartListStatusRows;
}

async function insertOrders(connection, insertOrdersInfoParams) {
    const insertOrdersQuery = `
    INSERT INTO orderHistory 
                (userId, destinationId, couponId, subOrderFee, discountPrice, deliveryFee, totalOrderFee,
                toStore, needDisposable, toRider, paymentType, paymentId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [ordersRows] = await connection.query(insertOrdersQuery, insertOrdersInfoParams);
    return ordersRows
}

async function editCartListStatus(connection, orderHistoryId, userId) {
    const editCartListStatusQuery = `
    UPDATE cart
    SET status = ?
    WHERE userId = ? AND status = 'ACTIVE';
    `;
    const [cartListStatusRows] = await connection.query(editCartListStatusQuery, [orderHistoryId, userId]);
    return cartListStatusRows;
}

async function selectOrderHistoryById(connection, userId, orderHistoryId) {
    const selectOrderHistoryByIdQuery = `
    SELECT
        c.storeId,
        s.name,
        (CASE 
            WHEN oh.status = "UPCOMING" THEN "메뉴 준비중"
        END) AS menuStatus,
        oh.createdAt AS orderTime,
        oh.totalOrderFee
    FROM orderHistory oh
        INNER JOIN cart c ON c.status = oh.orderHistoryId
        INNER JOIN store s on s.storeId = c.storeId
    WHERE oh.userId = ? AND oh.orderHistoryId = ?
    GROUP BY oh.orderHistoryId;
    `;
    const [orderHistoryByIdRows] = await connection.query(selectOrderHistoryByIdQuery, [userId, orderHistoryId]);
    return orderHistoryByIdRows
}

async function selectCartListByOrderHistoryId(connection, orderHistoryId) {
    const selectCartListByOrderHistoryIdQuery = `
    SELECT 
        c.menuId, m.name, c.menuOptionIds
    FROM cart c
    INNER JOIN menu m ON m.menuId = c.menuId
    WHERE c.status = 2;
    `;
    const [cartListByOrderHistoryIdRows] = await connection.query(selectCartListByOrderHistoryIdQuery, orderHistoryId);
    return cartListByOrderHistoryIdRows;
}

module.exports = {
    selectDestinationByUserId,
    selectStoreInCart,
    selectCartListByUserId,
    selectMenuOptionDetail,
    selectCouponListByParams,
    selectPaymentByUserId,
    selectStoreByUserId,
    selectCartByParams,
    insertCartInfo,
    updateCartInfo,
    deleteCartListStatus,
    insertOrders,
    editCartListStatus,
    selectOrderHistoryById,
    selectCartListByOrderHistoryId
};