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
  const shop = shopData.getShop(shopId)
  name = valid.stringValidate(name)
  description = valid.stringValidate(description)
  valid.numCheck(price)
  if(price < 1 || price > 5){
    throw 'invalid rating'
  }
  if(!Number.isInteger(price)){
    maxDecimal(price, 2)
  }
  tags = valid.arrayOfStrings(tags)
  allergens = valid.arrayOfStrings(allergens)
  const item = {
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

const exportedMethods = {
    getAllItemsFromShop,
    getItem,
    createItem
}
export default exportedMethods;