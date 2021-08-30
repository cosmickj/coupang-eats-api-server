const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/* /app/reviews/stores/:storeId?photo=y */
exports.getReviews = async function (req, res) {
    const storeId = req.params.storeId;
    const isPhoto = req.query.photo;

    const reviewListByStoreIdResult = await reviewProvider.retrieveReviewListByStoreId(storeId, isPhoto);
    return res.send(response(baseResponse.SUCCESS, reviewListByStoreIdResult));
}