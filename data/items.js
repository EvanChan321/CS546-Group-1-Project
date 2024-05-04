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
  return item
}

const createItem = async (shopId, name, description, price, tags, allergens, calories) => {
  const shop = await shopData.getShop(shopId)
  name = valid.stringValidate(name)
  description = valid.stringValidate(description)
  valid.numCheck(price)
  valid.numCheck(calories)
  valid.intCheck(calories)
  if(price <= 0){
    throw 'invalid pricing'
  }
  if(calories < 0){
    throw 'invalid calories'
  }
  const numStr = price.toString();
  const decimalRegex = /\.\d{3,}$/;
  if(decimalRegex.test(numStr)){
    throw 'invalid pricing'
  }
  tags = valid.arrayOfStrings(tags)
  allergens = valid.arrayOfStrings(allergens)
  let x = new ObjectId();
  const item = {
    _id: x,
    shopId: shopId,
    name: name,
    description: description,
    price: price,
    calories: calories,
    tags: tags,
    allergens: allergens,
    reviews: [],
    averageRating: "No Ratings"
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
    valid.numCheck(updateObject.price)
    if(updateObject.price <= 0){
      throw 'invalid pricing'
    }
    item.price = updateObject.price
  }
  if('calories' in updateObject){
    valid.intCheck(updateObject.calories)
    if(updateObject.calories < 0){
      throw 'invalid pricing'
    }
    item.price = updateObject.calories
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
    { 'items._id': new ObjectId(itemId) },
    { $set: { 'item.$': update } },
    {returnDocument: 'after'}
  );
  if (!updatedInfo) {
    throw 'could not update item successfully';
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