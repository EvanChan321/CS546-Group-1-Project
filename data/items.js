import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import shopData from './shops.js';

const getAllItemsFromShop = async (shopId) => {
  shopId = valid.idCheck(shopId)
  const shop = await shopData.getShop(shopId);
  return shop.items
}

const getItem = async (itemId) => {
  itemId = valid.idCheck(itemId)
  const shopCollection = await shops();
  const foundShop = await shopCollection.findOne(
    { 'items._id': new ObjectId(itemId) }
  );
  if(!foundShop){
    throw 'cant find shop'
  }
  const item = foundShop.items.find(item => item._id.equals(new ObjectId(itemId)));
  if (!item) {
    throw 'cannot find item';
  }
  //foundReview._id = foundReview._id.toString();
  return review
}

const createItem = async (shopId, name, description, price, tags, allergens) => {
  const shop = await shopData.getShop(shopId)
  name = valid.stringValidate(name)
  description = valid.stringValidate(description)
  valid.numCheck(price)
  if(price < 1 || price > 5){
    throw 'invalid rating'
  }
  if(!Number.isInteger(price)){
    maxDecimal(price, 0)
  }
  tags = valid.arrayOfStrings(tags)
  allergens = valid.arrayOfStrings(allergens)
  let x = new ObjectId();
  const item = {
    _id: x,
    name: name,
    description: description,
    price: price,
    tags: tags,
    allergens: allergens
  }
  shop.items.push(item)
  const shopCollection = await shops();
  const shopUpdatedInfo = await shopCollection.findOneAndUpdate(
    {_id: new ObjectId(shopId)},
    {$set: shop},
    {returnDocument: 'after'}
  )
  if (!shopUpdatedInfo) {
    throw 'could not update product successfully';
  }
  return item;
}

const updateItem = async (itemId, updateObject) => {
  const item = await getItem(itemId)
  if('name' in updateObject){
    updateObject.name = valid.stringValidate(updateObject.name)
    item.name = updateObject.name
  }
  if('description' in updateObject){
    updateObject.description = valid.stringValidate(updateObject.description)
    item.description = updateObject.description
  }
  if('price' in updateObject){
    updateObject.flagReason = valid.stringValidate(updateObject.name)
    description = valid.stringValidate(description)
    valid.numCheck(price)
    if(price < 1 || price > 5){
      throw 'invalid rating'
    }
    if(!Number.isInteger(price)){
      maxDecimal(price, 0)
    }
    item.description = updateObject.description
  }
  if('tags' in updateObject){
    tags = valid.arrayOfStrings(tags)
    item.tags = updateObject.tags
  }
  if('allergens' in updateObject){
    allergens = valid.arrayOfStrings(allergens)
    item.allergens = updateObject.allergens
  }
  const shopCollection = await shops();
  const updatedInfo = await shopCollection.findOneAndUpdate(
    { 'items._id': new ObjectId(reviewId) },
    { $set: { 'flags.$': update } },
    {returnDocument: 'after'}
  );
  if (!updatedInfo) {
    throw 'could not update product successfully';
  }
  return updatedInfo
}

const deleteItem = async (itemId) => {
  itemId = valid.idCheck(itemId)
  const item = await this.getFlag(itemId)
  const shopCollection = await shops();
  const updatedInfo = await shopCollection.findOneAndUpdate(
    { 'items._id': new ObjectId(itemId) },
    { $pull: { items: { _id: new ObjectId(itemId) } } },
    { returnDocument: 'after' }
  );
  if(!updatedInfo){
    throw 'could not delete'
  }
  return updatedInfo
}

const exportedMethods = {
    getAllItemsFromShop,
    getItem,
    createItem,
    updateItem,
    deleteItem
}
export default exportedMethods;