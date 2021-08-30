// 홈화면 SQL 시작
async function selectEvents(connection) {
    const selectEventsQuery = `
    SELECT
        eventId,
        bannerImageUrl,
        expiryDate
    FROM event
    ORDER BY -expiryDate DESC;
    `;
    const [eventBannerRows] = await connection.query(selectEventsQuery);
    return eventBannerRows
}

async function selectFranchiseStores(connection) {
    const selectFranchiseStoresQuery = `
    SELECT
        s.storeId,
        s.name,
        Concat(Round(Avg(r.rating), 1), ' (', Count(r.rating), ')') AS rating,
        s.latitude,
        s.longitude,
        (CASE
            WHEN s.deliveryFeeHigh = 0 THEN "무료배달"
            ELSE Concat('배달비 ', Format(s.deliveryFeeHigh, 0), '원')
        END) AS deliveryFee,
        si.imageUrl
    FROM store s
        INNER JOIN storeTypeRelation str ON str.storeId = s.storeId
        LEFT JOIN review r ON r.storeId = s.storeId
        LEFT JOIN storeImage si ON si.storeId = s.storeId
    WHERE str.typeId = 25
    GROUP BY s.name
    ORDER BY imageUrl DESC;
    `;
    const [frachiseStoreRows] = await connection.query(selectFranchiseStoresQuery);
    return frachiseStoreRows
}

async function selectNewStores(connection) {
    const selectNewStoresQuery = `
    SELECT 
        s.storeId,
        s.name,
        si.imageUrl,
        Concat(Round(Avg(r.rating), 1), ' (', Count(r.rating), ')') AS rating,
        s.latitude,
        s.longitude,
        (CASE
            WHEN s.deliveryFeeHigh = 0 THEN '무료배달'
            ELSE Concat('배달비 ', Format(s.deliveryFeeHigh, 0), '원')
        END) AS deliveryFee,
        s.createdAt
    FROM store s
        LEFT JOIN review r ON r.storeId = s.storeId
        LEFT JOIN storeImage si ON si.storeId = s.storeId
    WHERE Datediff(Now(), s.createdat) < 7
    GROUP BY s.name
    ORDER BY imageurl DESC; 
    `;
    const [newStoreRows] = await connection.query(selectNewStoresQuery);
    return newStoreRows
}

async function selectStores(connection) {
    const selectStoresQuery = `
    SELECT
        s.storeId,
        s.name,
        Concat(Round(Avg(r.rating), 1), ' (', Count(r.rating), ')') AS rating,
        (CASE
            WHEN s.deliveryFeeHigh = 0 THEN "무료배달"
            ELSE Concat('배달비 ', Format(s.deliveryFeeHigh, 0), '원')
        END) AS deliveryFee,
        (CASE
            WHEN s.cheetahDelivery = 'Y' THEN '치타배달'
            WHEN s.cheetahDelivery = 'N' THEN NULL
        END ) AS cheetahDelivery,
        (CASE
            WHEN Datediff(Now(),s.createdat) < 7 THEN "신규" 
            ELSE NULL
        END) AS isnew,
        Concat(s.minimumdeliverytime, '-', s.maximumdeliverytime, '분') AS deliveryTime,
        s.latitude,
        s.longitude,
        si.imageurl
    FROM store s
        LEFT JOIN review r ON r.storeId = s.storeId
        LEFT JOIN storeImage si ON si.storeId = s.storeId
    GROUP BY s.name
    ORDER BY imageurl DESC;
    `;
    const [storeRows] = await connection.query(selectStoresQuery);
    return storeRows;
  }
// 홈화면 SQL 끝

// 매장 조회 SQL 시작
async function selectStoreImageById(connection, storeId) {
    const selectStoreImageByIdQuery = `
    SELECT 
        storeImageId,
        storeId,
        imageUrl
    FROM storeImage
    WHERE storeId = ? AND status = 'ACTIVE';
    `;
    const [storeImageRows] = await connection.query(selectStoreImageByIdQuery, storeId);
    return storeImageRows;
}

async function selectStoreById(connection, storeId) {
    const selectStoreByIdQuery = `
    SELECT 
        s.storeId,
        s.name,
        ROUND(AVG(r.rating), 1) AS averageRating,
        (CASE
            WHEN COUNT(r.rating) > 0 THEN CONCAT("리뷰 ",COUNT(r.rating),"개")
            ELSE NULL
        END) AS countRating,
        CONCAT(s.minimumDeliveryTime, '-', s.maximumDeliveryTime, '분') AS deliveryTime,
        (CASE
            WHEN s.cheetahDelivery = 'Y' THEN '치타배달'
            WHEN s.cheetahDelivery = 'N' THEN NULL
        END) AS cheetahDelivery,
        (CASE
            WHEN s.deliveryFeeLow = 0 THEN '무료배달'
            ELSE Concat('배달비 ', Format(s.deliveryFeeHigh, 0), '원')
        END) AS deliveryFee,
        CONCAT(FORMAT(s.minimumOrderPrice,0),'원') AS minimumOrderPrice
    FROM store s
        LEFT JOIN review r ON r.storeId = s.storeId
    WHERE s.storeId = ? AND s.status = 'ACTIVE';
    `;
    const [storeByIdRows] = await connection.query(selectStoreByIdQuery, storeId);
    return storeByIdRows;
}

async function selectStorePhotoReviewById(connection, storeId) {
    const selectStorePhotoReviewByIdQuery = `
    SELECT 
        r.reviewId,
        r.rating,
        r.content,
        ri.imageUrl
    FROM review r
        LEFT JOIN reviewImage ri ON ri.reviewId = r.reviewId
    WHERE r.storeId = ? AND ri.imageUrl IS NOT NULL AND r.status = 'ACTIVE'
    ORDER BY r.createdAt DESC;
    `;
    const [storePhotoReviewByIdRows] = await connection.query(selectStorePhotoReviewByIdQuery, storeId);
    return storePhotoReviewByIdRows;
}
// 매장 조회 SQL 끝

// 메뉴 조회 SQL 시작
async function selectStoreMenuById(connection, storeId) {
    const selectStoreMenuByIdQuery = `
    SELECT
        mc.menuCategoryId,
        mc.title AS menuCategory,
        mc.description AS menuCategoryDescription,
        m.menuId,
        m.name AS menuName,
        m.description AS menuDescription,
        m.price,
        m.orderMany,
        m.reviewGreat,
        mi.imageUrl
    FROM menuCategory mc
        INNER JOIN menu m ON m.menuCategoryId = mc.menuCategoryId
        INNER JOIN menuImage mi ON mi.menuId = m.menuId
    WHERE  mc.storeId = ? AND m.status = 'ACTIVE';
    `;
    const [storeMenuByIdRows] = await connection.query(selectStoreMenuByIdQuery, storeId);
    return storeMenuByIdRows;
}

async function selectMenuOptionCategories(connection, menuId) {
    const selectMenuOptionCategoriesQuery = `
    SELECT menuOptionCategoryId
    FROM   menuOption
    WHERE  menuId = ?
    GROUP  BY menuOptionCategoryId;
    `;
    const [menuOptionCategoriesRows] = await connection.query(selectMenuOptionCategoriesQuery, menuId);
    return menuOptionCategoriesRows
}

async function selectMenuOptionCategoryById(connection, menuOptionCategoryId) {
    const selectMenuOptionCategoryByIdQuery = `
    SELECT
        title,
        isRequired,
        categoryType,
        checkboxLimit
    FROM  menuOptionCategory
    WHERE menuOptionCategoryId = ?;
    `;
    const [menuOptionCategoryByIdRows] = await connection.query(selectMenuOptionCategoryByIdQuery, menuOptionCategoryId);
    return menuOptionCategoryByIdRows;
}

async function selectMenuOptionById(connection, menuOptionCategoryId) {
    const selectMenuOptionByIdQuery = `
    SELECT 
        content,
        (CASE
            WHEN price != 0 THEN CONCAT('(+',FORMAT(price,0),'원)')
            ELSE ""
        END) AS price,
        isSoldOut
    FROM  menuOption
    WHERE menuOptionCategoryId = ?;
    `;
    const [menuOptionByIdRows] = await connection.query(selectMenuOptionByIdQuery, menuOptionCategoryId);
    return menuOptionByIdRows;
}

async function selectStoresByType(connection, storeType) {
    const selectStoresByTypeQuery = `
    SELECT
        s.storeId,
        s.name,
        (CASE
            WHEN s.cheetahDelivery = "Y" THEN "치타배달"
            ELSE ""
        END) AS cheetahDelivery,
        Concat(Round(Avg(r.rating), 1), ' (', Count(r.rating), ')') AS rating,
        (CASE
            WHEN s.deliveryFeeHigh = 0 THEN "무료배달"
            ELSE Concat('배달비 ', Format(s.deliveryFeeHigh, 0), '원')
        END) AS deliveryFee,
        CONCAT(s.minimumDeliveryTime,'-',s.maximumDeliveryTime,'분') AS deliveryTime,
        s.latitude,
        s.longitude
    FROM store s
        LEFT JOIN storeTypeRelation str ON str.storeId = s.storeId
        LEFT JOIN review r ON r.storeId = s.storeId
    WHERE str.typeId = (SELECT typeId FROM storeType WHERE title = ?)
    GROUP BY s.storeId;
    `;
    const [storesByTypeRows] = await connection.query(selectStoresByTypeQuery, storeType);
    return storesByTypeRows
}

async function retrieveStoreImageByStoreId(connection, storeId) {
    const retrieveStoreImageByStoreIdQuery = `
    SELECT imageUrl
    FROM storeImage
    WHERE storeId = ?
    LIMIT 1;
    `;
    const [storeImageByStoreIdRows] = await connection.query(retrieveStoreImageByStoreIdQuery, storeId);
    return storeImageByStoreIdRows;
}

async function retrieveMenuImageListByStoreId(connection, storeId) {
    const retrieveMenuImageListByStoreId = `
    SELECT mi.imageUrl
    FROM menuCategory mc
        INNER JOIN menu m ON m.menuCategoryId = mc.menuCategoryId
        INNER JOIN menuImage mi ON mi.menuId = m.menuId
    WHERE mc.storeId = ? AND (m.orderMany = 'Y' OR m.reviewGreat = 'Y')
    LIMIT 2;
    `;
    const [menuImageListByStoreIdRows] = await connection.query(retrieveMenuImageListByStoreId, storeId);
    return menuImageListByStoreIdRows;
}

module.exports = {
    selectEvents,
    selectFranchiseStores,
    selectNewStores,
    selectStores,
    selectStoreImageById,
    selectStoreById,
    selectStorePhotoReviewById,
    selectStoreMenuById,
    selectMenuOptionCategories,
    selectMenuOptionCategoryById,
    selectMenuOptionById,
    selectStoresByType,
    retrieveStoreImageByStoreId,
    retrieveMenuImageListByStoreId
};
