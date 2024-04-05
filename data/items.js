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

const exportedMethods = {
    getAllItemsFromShop,
    getItem
  }
  export default exportedMethods;