async function insertDestinationInfo(connection, insertDestinationInfoParams) {
    const insertDestinationInfoQuery = `
    INSERT INTO destination(userId, name, address, streetAddress, addressDetail, addressDirection, type)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const [destinationInfoRows] = await connection.query(insertDestinationInfoQuery, insertDestinationInfoParams);
    return destinationInfoRows;
};

async function updateDestinationInfo(connection, editDestinationResponse) {
    const updateDestinationInfoQuery = `
    UPDATE destination
	SET name = ?, address = ?, streetAddress = ?, addressDetail = ?, addressDirection = ?, type = ?
    WHERE destinationId = ?;
    `;
    const [destinationInfoRows] = await connection.query(updateDestinationInfoQuery, editDestinationResponse);
    return destinationInfoRows;
}

async function updateDestinationStatus(connection, destinationId) {
    const updateDestinationStatusQuery = `
    UPDATE destination
    SET status = 'DELETE'
    WHERE destinationId = ?;
    `;
    const [destinationStatusRows] = await connection.query(updateDestinationStatusQuery, destinationId);
    return destinationStatusRows;
}

module.exports = {
    insertDestinationInfo,
    updateDestinationInfo,
    updateDestinationStatus
};