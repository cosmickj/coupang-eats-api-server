const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.getStores = async function (req, res) {
    const storesResult = await storeProvider.retrieveStoreList();
    return res.send(response(baseResponse.SUCCESS,storesResult));
}

exports.getStoreById = async function(req, res) {
    const storeId = req.params.storeId;
    const storeByIdResult = await storeProvider.retrieveStore(storeId);

    if (storeByIdResult.store[0].name == null)
        return res.send(errResponse(baseResponse.STORE_NOT_EXIST));

    return res.send(response(baseResponse.SUCCESS,storeByIdResult));
}

exports.getMenuById = async function (req, res) {
    const menuId = req.params.menuId;
    const menuByIdResult = await storeProvider.retrieveMenu(menuId);

    if (Object.keys(menuByIdResult).length == 0)
        return res.send(errResponse(baseResponse.MENU_NOT_EXIST));
        
    return res.send(response(baseResponse.SUCCESS,menuByIdResult));
}

/* /app/stores-type?title=$ */
exports.getStoresByType = async function (req, res) {
    const storeType = req.query.title;

    // title이 이상한 글자로 들어올때
    // if (!storeType)
    //     return res.send('제대로 입력해라')

    const storesByTypeResult = await storeProvider.retrieveStoreListByType(storeType);

    return res.send(response(baseResponse.SUCCESS, storesByTypeResult));
}