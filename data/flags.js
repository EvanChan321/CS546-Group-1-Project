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
    const foundFlag = await shopCollection.findOne(
      { 'flags._id': new ObjectId(flagId) }
    );
    if(!foundFlag){
      throw 'cant find shop'
    }
    const flag = foundFlag.flags.find(flag => flag._id.equals(new ObjectId(flagId)));
    if (!flag) {
      throw 'cannot find flag';
    }
    return flag
}

const createFlag = async (shopId, userId, flagReason) => {
  const shop = await shopData.getShop(shopId)
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
  return flag;
}
const updateFlag = async (flagId, updateObject) => {
  const flag = await getFlag(flagId)
  if('userId' in updateObject){
    updateObject.userId = valid.idCheck(updateObject.userId)
    flag.userId = updateObject.userId
  }
  if('flagReason' in updateObject){
    updateObject.flagReason = valid.stringValidate(updateObject.flagReason)
    flag.flagReason = updateObject.flagReason
  }
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  flag.flagDate = currentDateString
  const shopCollection = await shops();
  const updatedInfo = await shopCollection.findOneAndUpdate(
    { 'flags._id': new ObjectId(reviewId) },
    { $set: { 'flags.$': update } },
    {returnDocument: 'after'}
  );
  if (!updatedInfo) {
    throw 'could not update product successfully';
  }
  return updatedInfo
}

const deleteFlag = async (flagId) => {
  flagId = valid.idCheck(flagId)
  const flag = await getFlag(flagId)
  const shopCollection = await shops();
  const updatedInfo = await shopCollection.updateOne(
    { 'flags._id': new ObjectId(flagId) },
    { $pull: { flags: { _id: new ObjectId(flagId) } } }
  );
  if(!updatedInfo){
    throw 'could not delete'
  }
  return updatedInfo
}

const exportedMethods = {
    getAllFlagsFromShop,
    getFlag,
    updateFlag,
    createFlag,
    deleteFlag
  }
  export default exportedMethods;