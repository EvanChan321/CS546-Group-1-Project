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
      throw 'cannot find flag';
    }
    //foundReview._id = foundReview._id.toString();
    return flag
}

const createFlag = async (shopId, userId, flagReason) => {
  const shop = shopData.getShop(shopId)
  flagReason = valid.stringValidate(flagReason)
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  let x = new ObjectId();
  const flag = {
    _id: x,
    userId: userId,
    flagReason: flagReason,
    flagDate: currentDateString
  }
  shop.flags.push(flag)
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
    getAllFlagsFromShop,
    getFlag,
    createFlag
  }
  export default exportedMethods;