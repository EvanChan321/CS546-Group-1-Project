import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import shopData from './shops.js';

const getAllFlagsFromShop = async (shopId) => {
    shopId = valid.idCheck(shopId)
    const shop = await shopData.getShop(shopId);
    return shop.flags
}

const getFlag = async (flagId) => {
    flagId = valid.idCheck(flagId)
    const shopCollection = await shops();
    const foundShop = await shopCollection.findOne(
      { 'flags._id': new ObjectId(flagId) }
    );
    if(!foundShop){
      throw 'cant find shop'
    }
    const flag = foundShop.flags.find(flag => flag._id.equals(new ObjectId(flagId)));
    if (!flag) {
      throw 'cannot find item';
    }
    //foundReview._id = foundReview._id.toString();
    return flag
}

const exportedMethods = {
    getAllFlagsFromShop,
    getFlag
  }
  export default exportedMethods;