async function selectPaymentListByUserId(connection, userId) {
    const selectPaymentListByUserIdQuery = `
    SELECT
        "card" AS paymentType,
        pc.paymentCardId AS paymentId,
        pc.cardName AS paymentName,
        CONCAT('****',SUBSTR(pc.cardNumber,13,3),'*') AS paymentNumber
    FROM user u 
        RIGHT JOIN paymentCard pc ON pc.userId = u.userId
    WHERE u.userId = ${userId} AND pc.status = 'ACTIVE'
    UNION SELECT
        "bank" AS paymentType,
        pb.paymentBankId,
        pb.brand,
        CONCAT("****",RIGHT(pb.bankAccount,4)) AS paymentNumber
    FROM user u 
        RIGHT JOIN paymentBank pb ON pb.userId = u.userId
    WHERE u.userId = ${userId} AND pb.status = 'ACTIVE';
    `;
    const [paymentListByUserIdRows] = await connection.query(selectPaymentListByUserIdQuery, userId);
    return paymentListByUserIdRows
};

async function insertPaymentBankInfo(connection,insertPaymentBankInfoParams) {
    const insertPaymentBankInfoQuery = `
    INSERT INTO paymentBank (userId, brand, bankAccount, userName)
    VALUES (?, ?, ?, ?);
    `;
    const [paymentBankInfoRows] = await connection.query(insertPaymentBankInfoQuery, insertPaymentBankInfoParams);
    return paymentBankInfoRows;
};

async function selectUserNameByUserId(connection, userId) {
    const selectUserNameByUserIdQuery = `
    SELECT name FROM user
    WHERE userId = ?;
    `;
    const [userNameByUserIdRows] = await connection.query(selectUserNameByUserIdQuery, userId);
    return userNameByUserIdRows;
};

async function selectPaymentBankByParams(connection, brand, bankAccount) {
    const selectPaymentBankByParamsQuery = `
    SELECT paymentBankId FROM paymentBank
    WHERE brand = ? AND bankAccount = ?;
    `;
    const [paymentBankByParamsRows] = await connection.query(selectPaymentBankByParamsQuery, [brand, bankAccount]);
    return paymentBankByParamsRows;
};

async function deletePaymentBankById(connection, paymentBankId) {
    const deletePaymentBankByIdQuery = `
    UPDATE paymentBank
    SET status = 'DELETE'
    WHERE paymentBankId = ?;
    `;
    const [paymentBankByIdQueryRows] = await connection.query(deletePaymentBankByIdQuery, paymentBankId);
    return paymentBankByIdQueryRows;
};

async function selectPaymentBankByParams(connection, userId, paymentBankId) {
    const retrieveBankStatusByParamsQuery = `
    SELECT status
    FROM paymentBank
    WHERE userId = ? AND paymentBankId = ?;
    `;
    const [bankStatusByParamsRows] = await connection.query(retrieveBankStatusByParamsQuery, [userId, paymentBankId]);
    return bankStatusByParamsRows;
}

async function insertPaymentCardInfo(connection, insertPaymentCardInfoParams) {
    const insertPaymentCardInfoQuery = `
    INSERT INTO paymentCard (userId, brand, cardName, cardNumber, expiryMonth, expiryYear, cvcNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const [paymentCardInfoRows] = await connection.query(insertPaymentCardInfoQuery, insertPaymentCardInfoParams);
    return paymentCardInfoRows;
}

async function selectPaymentCardByNumber(connection, cardNumber) {
    const selectPaymentCardByNumberQuery = `
    SELECT paymentCardId
    FROM paymentCard
    WHERE cardNumber = ?;
    `;
    const [paymentCardByNumberRows] = await connection.query(selectPaymentCardByNumberQuery, cardNumber);
    return paymentCardByNumberRows;
}

async function selectPaymentCardByParams(connection, userId, paymentCardId) {
    const selectPaymentCardByParamsQuery = `
    SELECT status
    FROM paymentCard
    WHERE userId = ? AND paymentCardId = ?;
    `;
    const [paymentCardByParamsRows] = await connection.query(selectPaymentCardByParamsQuery, [userId, paymentCardId]);
    return paymentCardByParamsRows;
}

async function deletePaymentCardById(connection, paymentCardId) {
    const deletePaymentCardByIdQuery = `
    UPDATE paymentCard
    SET status = 'DELETE'
    WHERE paymentCardId = ?;
    `;
    const [paymentCardByIdRows] = await connection.query(deletePaymentCardByIdQuery, paymentCardId);
    return paymentCardByIdRows;
}

module.exports = {
    selectPaymentListByUserId,
    insertPaymentBankInfo,
    selectUserNameByUserId,
    selectPaymentBankByParams,
    deletePaymentBankById,
    selectPaymentBankByParams,
    insertPaymentCardInfo,
    selectPaymentCardByNumber,
    selectPaymentCardByParams,
    deletePaymentCardById
};