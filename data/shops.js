import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import { reviewData, shopData } from "./index.js";


const getAllShops = async () => {
    const shopCollection = await shops();
    const allShops = await shopCollection.find().toArray();
    if(allShops.length === 0){
        throw "Shops Collection is Empty";
    }
    return allShops;
}

const getShop = async (id) => {
    id = valid.idCheck(id)
    const shopCollection = await shops();
    const findShop = await shopCollection.findOne({_id: new ObjectId(id)})
    if (findShop === null) throw 'No shop with that id'
    //findUser._id = findUser._id.toString();
    return findShop
}

const createShop = async (name, address, website, phoneNumber, hour1, minute1, ampm1, hour2, minute2, ampm2, ownerId) => {
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
    let {openTime, closeTime} = valid.convertTime(hour1, minute1, ampm1, hour2, minute2, ampm2)
    const newShop = {
        name: name,
        address: address,
        website: website,
        phoneNumber: phoneNumber,
        flags: [],
        items: [],
        reviews: [],
        openTime: openTime,
        closeTime: closeTime,
        averageRating: "No Ratings",
        numOfLikes: 0,
        ownerId: ownerId
    }
    const shopCollection = await shops();
    const insertInfo = await shopCollection.insertOne(newShop);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add product';
    const newId = insertInfo.insertedId.toString();
    const shop = await getShop(newId);
    return shop;
}

const updateShop = async (shopId, updateObject) => {
    shopId = valid.stringValidate(shopId)
    const shop = await getUser(shopId)
    const shopCollection = await shops()
    if('ownerId' in updateObject){
        updateObject.ownerId = valid.idCheck(updateObject.ownerId)
        let user = userData.getUser(updateObject.ownerId)
        user.shopList.push(shopId)
        let user2 = userData.getUser(shop.ownerId)
        const index = user2.shopList.indexOf(shopId);
        if (index !== -1) {
          shop.shopList.splice(index, 1);
        }
        await userData.updateUser(user._id, user)
        await userData.updateUser(user2._id, user2)
        shop.ownerId = updateObject.ownerId
    }
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
    if('openTime' in updateObject){
        shop.openTime = updateObject.openTime 
    }
    if('closeTime' in updateObject){
        shop.closeTime = updateObject.closeTime 
        
    }
    const updatedInfo = await shopCollection.findOneAndUpdate(
      {_id: new ObjectId(userId)},
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