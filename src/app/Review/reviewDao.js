async function selectReviewListByStoreId(connection, storeId, isPhoto) {
    let selectReviewListByStoreIdQuery = `
    SELECT
        r.reviewId,
        r.rating,
        r.content,
        ri.imageUrl,
        (SELECT GROUP_CONCAT(m.name SEPARATOR ' · ') AS orderedMenu
        FROM cart c
            INNER JOIN menu m ON m.menuId = c.menuId
        WHERE
            c.userId = r.userId 
            AND c.status = r.orderHistoryId) AS orderedMenu
    FROM review r
        LEFT JOIN reviewImage ri ON ri.reviewId = r.reviewId
    WHERE r.storeId = ? AND r.status = 'ACTIVE'
    `;

    if (isPhoto == 'y') {
        selectReviewListByStoreIdQuery += 'AND ri.imageUrl IS NOT NULL;'
    } else {
        selectReviewListByStoreIdQuery += ';'
    }
    
    const [reviewListByStoreIdRows] = await connection.query(selectReviewListByStoreIdQuery, storeId);
    return reviewListByStoreIdRows;
}

module.exports = {
    selectReviewListByStoreId
};