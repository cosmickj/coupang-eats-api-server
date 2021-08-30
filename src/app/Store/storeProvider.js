const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

exports.retrieveStoreList = async function () {
    const connection = await pool.getConnection(async (conn) => conn);

    const eventListResult = await storeDao.selectEvents(connection)
    const storeListResult = await storeDao.selectStores(connection)
    const franchiseStoreListResult = await storeDao.selectFranchiseStores(connection)
    const newStoreListResult = await storeDao.selectNewStores(connection)

    const totalStoreList = {
        eventBanners: eventListResult,
        franchiseStores : franchiseStoreListResult,
        newStores : newStoreListResult,
        stores : storeListResult,
    }

    connection.release();
    return totalStoreList;
}

exports.retrieveStore = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const storeResult = await storeDao.selectStoreById(connection, storeId);
    const storeImageListResult = await storeDao.selectStoreImageById(connection, storeId);
    const storePhotoReviewListResult = await storeDao.selectStorePhotoReviewById(connection, storeId);
    const storeMenuListResult = await storeDao.selectStoreMenuById(connection, storeId);

    const storeInfo = {
        storeImages : storeImageListResult,
        store : storeResult,
        storePhotoReviews : storePhotoReviewListResult,
        storeMenus : storeMenuListResult
    }

    connection.release();
    return storeInfo;
}

exports.retrieveMenu = async function (menuId) {
    const connection = await pool.getConnection(async (conn) => conn);

    const menuOptionCategoryListResult = await storeDao.selectMenuOptionCategories(connection, menuId);

    let menuOptionInfo = {}
    for (let x in menuOptionCategoryListResult) {
        let menuOptionCategoryId = menuOptionCategoryListResult[x].menuOptionCategoryId;

        const menuOptionCategoryResult = await storeDao.selectMenuOptionCategoryById(connection, menuOptionCategoryId);
        const menuOptionListResult = await storeDao.selectMenuOptionById(connection, menuOptionCategoryId);

        menuOptionInfo['menuOptionCategory' + x] = menuOptionCategoryResult;
        Object.assign(menuOptionInfo['menuOptionCategory'+x][0], {'menuOption':menuOptionListResult})
    }
    
    connection.release();
    return menuOptionInfo;
}

exports.retrieveStoreListByType = async function (storeType) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeListByTypeResult = await storeDao.selectStoresByType(connection, storeType);
    
    for (let x of storeListByTypeResult) {
        let images = []
        const storeImageByStoreIdResult = await storeDao.retrieveStoreImageByStoreId(connection, x.storeId);
        if (storeImageByStoreIdResult.length > 0) {
            images.push(storeImageByStoreIdResult[0].imageUrl);
        }
        
        const menuImageListByStoreIdResult = await storeDao.retrieveMenuImageListByStoreId(connection, x.storeId);
        if (menuImageListByStoreIdResult.length == 2) {
            images.push(menuImageListByStoreIdResult[0].imageUrl);
            images.push(menuImageListByStoreIdResult[1].imageUrl);
        }
        x['storeImages'] = images
    }

    connection.release();
    return storeListByTypeResult
}