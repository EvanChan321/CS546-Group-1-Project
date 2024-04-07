import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";


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

const createShop = async (ownerId, name, address, website, phoneNumber) => {
    if(ownerId !== null){
        ownerId = valid.idCheck(ownerId)
    }
    name = valid.stringValidate(name)
    address = valid.stringValidate(address)
    website = valid.urlCheck(website)
    phoneNumber = valid.phoneNumberCheck(phoneNumber)
    const newShop = {
        name: name,
        address: address,
        website: website,
        phoneNumber: phoneNumber,
        flags: [],
        items: [],
        reviews: [],
        averageRating: "No Ratings"
    }
    const shopCollection = await shops();
    const insertInfo = await shopCollection.insertOne(newShop);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add product';
    const newId = insertInfo.insertedId.toString();
    const shop = await this.getShop(newId);
    return shop;
}

const updateShop = async (shopId, updateObject) => {
    const shop = await getUser(shopId)
    const shopCollection = await shops()
    if('ownerId' in updateObject){
        updateObject.ownerId = valid.idCheck(updateObject.ownerId)
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

const exportedMethods = {
    getAllShops,
    getShop,
    updateShop,
    createShop
}
export default exportedMethods;