const jwtMiddleware = require("../../../config/jwtMiddleware");
const destinationProvider = require("../../app/Destination/destinationProvider");
const destinationService = require("../../app/Destination/destinationService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.postDestination = async function (req, res) {
    const {name, address, streetAddress, addressDetail, addressDirection, type} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const userId = req.params.userId;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const insertDestinationInfoParams = [userId, name, address, streetAddress, addressDetail, addressDirection, type]
    const addDestinationResponse = await destinationService.createDestination(insertDestinationInfoParams);
    return res.send(addDestinationResponse);
}

/* /app/users/:userId/destinations/:destinationId/edit */
exports.patchDestination = async function (req, res) {
    const {name, address, streetAddress, addressDetail, addressDirection, type} = req.body;
    const userIdFromJWT = req.verifiedToken.userId
    const {userId, destinationId} = req.params;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const editDestinationInfoParams = [name, address, streetAddress, addressDetail, addressDirection, type, destinationId]
    const editDestinationResponse = await destinationService.editDestination(editDestinationInfoParams)
    return res.send(editDestinationResponse);
};

exports.patchDestinationStatus = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId
    const {userId, destinationId} = req.params;
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const removeDestinationResponse = await destinationService.removeDestination(destinationId);
    return res.send(removeDestinationResponse);
}