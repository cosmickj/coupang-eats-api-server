module.exports = function(app){
    const destination = require('./destinationController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 배달지 추가 API
    app.post('/app/users/:userId/destinations', jwtMiddleware, destination.postDestination);

    // 배달지 수정 API
    app.patch('/app/users/:userId/destinations/:destinationId/edit', jwtMiddleware, destination.patchDestination);

    // 배달지 삭제 API
    app.patch('/app/users/:userId/destinations/:destinationId/status', jwtMiddleware, destination.patchDestinationStatus);
};