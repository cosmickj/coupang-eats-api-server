module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 메인화면 API
    app.get('/app/stores', store.getStores);

    // 매장 조회 API
    app.get('/app/stores/:storeId', store.getStoreById);

    // 타입별 매장 조회 API
    app.get('/app/stores-type', store.getStoresByType);

    // 메뉴 조회 API
    app.get('/app/menus/:menuId', store.getMenuById);

};