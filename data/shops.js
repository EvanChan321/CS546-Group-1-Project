import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import { reviewData, shopData, userData } from "./index.js";


const getAllShops = async () => {
    const shopCollection = await shops();
    const allShops = await shopCollection.find().toArray();
    if(allShops.length === 0){
    }
    return allShops;
}

const getShop = async (id) => {
    id = valid.idCheck(id)
    const shopCollection = await shops();
    const findShop = await shopCollection.findOne({_id: new ObjectId(id)})
    if (findShop === null) throw 'No shop with that id'
    return findShop
}

const createShop = async (name, address, website, phoneNumber, hour1, minute1, ampm1, hour2, minute2, ampm2, customization, ownerId) => {
    if(ownerId){
        ownerId = valid.idCheck(ownerId)
    }
    else{
        ownerId = ""
    }
    name = valid.stringValidate(name)
    address = valid.stringValidate(address)
    website = valid.urlCheck(website)
    phoneNumber = valid.phoneNumberCheck(phoneNumber)
    valid.objectCheck(customization)
    let {openTime, closeTime} = valid.convertTime(hour1, minute1, ampm1, hour2, minute2, ampm2)
    for (const [key, value] of Object.entries(customization)) {
        valid.customizationCheck(key)
        valid.booleanCheck(value)
    }
    const newShop = {
        name: name,
        address: address,
        website: website,
        phoneNumber: phoneNumber,
        flags: [],
        items: [],
        reviews: [],
        customization: customization,
        openTime: openTime,
        closeTime: closeTime,
        customization: customization,
        averageRating: "No Ratings",
        numOfLikes: 0,
        ownerId: ownerId
    }
    const shopCollection = await shops();
    const cords = await valid.getLatLong(address);
    const allShops = await shopData.getAllShops()
    let duplicateAdd = false;
    for (const shop of allShops) {
        const currCords = await valid.getLatLong(shop.address);
        if (cords.lat === currCords.lat && cords.lng === currCords.lng) {
            duplicateAdd = true;
            break; 
        }
        if(shop.name.toLowerCase() === name.toLowerCase()){
            throw 'store with that name already exists'
        }
    }
    if(duplicateAdd) {
        throw "Store at this location already exists";
    }
    const insertInfo = await shopCollection.insertOne(newShop);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add product';
    const newId = insertInfo.insertedId.toString();
    const shop = await getShop(newId);
    return shop;
}

const updateShop = async (shopId, updateObject) => {
    shopId = valid.stringValidate(shopId)
    const shop = await getShop(shopId)
    const shopCollection = await shops()
    if('name' in updateObject){
        updateObject.name = valid.stringValidate(updateObject.name)
        shop.name = updateObject.name
    }
    if('website' in updateObject){
        updateObject.website = valid.urlCheck(updateObject.website)
        shop.website = updateObject.website
    }
    if('address' in updateObject){
        updateObject.address = valid.stringValidate(updateObject.address)
        shop.address = updateObject.address
    }
    if('phoneNumber' in updateObject){
        updateObject.phoneNumber = valid.phoneNumberCheck(updateObject.phoneNumber)
        shop.phoneNumber = updateObject.phoneNumber   
    }
    if('hour1' in updateObject){
        let {openTime, closeTime} = valid.convertTime(updateObject.hour1, updateObject.minute1, updateObject.ampm1, updateObject.hour2, updateObject.minute2, updateObject.ampm2)
        shop.openTime = openTime
        shop.closeTime = closeTime
    }
    if('customization' in updateObject){
        shop.customization = updateObject.customization
    }
    if('ownerId' in updateObject){
            shop.ownerId = updateObject.ownerId
    }
    const updatedInfo = await shopCollection.findOneAndUpdate(
      {_id: new ObjectId(shopId)},
      {$set: shop},
      {returnDocument: 'after'}
    )
    if (!updatedInfo) {
      throw 'could not update product successfully';
    }
    return updatedInfo
}

const removeShop = async (shopId) => {
    shopId = valid.idCheck(shopId)
    const shop = await getShop(shopId)
    const deletedReviews = shop.reviews.map(async (review) => await reviewData.removeReview(review.toString()));
    const deleted = await Promise.all(deletedReviews);
    const shopCollection = await shops();
    const deletionInfo = await shopCollection.findOneAndDelete({
        _id: new ObjectId(shopId)
    });
    if(!deletionInfo){
        throw 'could not delete'
      }
    return deletionInfo
}

const exportedMethods = {
    getAllShops,
    getShop,
    updateShop,
    createShop,
    removeShop
}
export default exportedMethods;