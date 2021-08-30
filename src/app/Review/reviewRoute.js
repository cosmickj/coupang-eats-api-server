module.exports = function(app){
    const review = require('./reviewController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 매장 리뷰 조회 API
    app.get('/app/reviews/stores/:storeId', review.getReviews)

};