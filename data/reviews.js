import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import userData from './users.js';
import shopData from './shops.js';

const getAllReviewsFromUser = async (userId) => {
    userId = valid.idCheck(userId)
    const user = await userData.getUser(userId);
    return user.reviews
}

const getAllReviewsForShop = async (shopId) => {
  const shop = await shopData.getShop(shopId)
  return shop.reviews;
}

const getReview = async (reviewId) => {
    reviewId = valid.idCheck(reviewId)
    const userCollection = await users();
    const foundUser = await userCollection.findOne(
      { 'reviews._id': new ObjectId(reviewId) }
    );
    if(!foundUser){
      throw 'cant find user'
    }
    const review = foundUser.reviews.find(review => review._id.equals(new ObjectId(reviewId)));
    if (!review) {
      throw 'cannot find review';
    }
    //foundReview._id = foundReview._id.toString();
    return review
}

const createReview = async (userId, objId, rating, review) => {
  userId = valid.idCheck(userId)
  const userReview = await userData.getUser(userId)
  objId = valid.idCheck(objId)
  const shopForReview = await shopData.getShop(objId)
  valid.numCheck(rating)
  valid.intCheck(rating)
  review = valid.stringValidate(review)
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  let x = new ObjectId();
  const newReview = {
    _id: x,
    objId: objId,
    rating: rating,
    review: review,
    reviewDate: currentDateString,
    comments: []
  }
  userReview.reviews.push(newReview)
  shopForReview.reviews.push(x)
  const len = shopForReview.reviews.length
  if(len == 1){
    shopForReview.averageRating = newReview.rating 
  }
  else{
    shopForReview.averageRating = ((shopForReview.averageRating*(len-1))+newReview.rating)/len
  }
  const shopCollection = await shops();
  const userCollection = await users();
  const userUpdatedInfo = await userCollection.findOneAndUpdate(
    {_id: new ObjectId(userId)},
    {$set: userReview},
    {returnDocument: 'after'}
  )
  if (!userUpdatedInfo) {
    throw 'could not update product successfully';
  }
  const shopUpdatedInfo = await shopCollection.findOneAndUpdate(
    {_id: new ObjectId(objId)},
    {$set: shopForReview},
    {returnDocument: 'after'}
  )
  if (!shopUpdatedInfo) {
    throw 'could not update product successfully';
  }
  return newReview;
}
const updateReview = async (reviewId, updateObject) => {
  const review = await getReview(reviewId)
  const obj = await getShop(review.objId)
  if('review' in updateObject){
    updateObject.review = valid.stringValidate(updateObject.review)
    review.review = updateObject.review
  }
  if('rating' in updateObject){
    valid.numCheck(updateObject.rating)
    valid.intCheck(updateObject.rating)
    if (review.rating !== updateObject.rating){
      obj.averageRating = (((obj.averageRating*obj.reviews.length)-review.rating)+updateObject.rating)/obj.reviews.length
      review.rating = updateObject.rating
    }
  }
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  review.reviewDate = currentDateString
  const userCollection = await users();
  const updatedUser = await userCollection.findOneAndUpdate(
    { 'reviews._id': new ObjectId(reviewId) },
    { $set: { 'reviews.$': update } },
    {returnDocument: 'after'}
  );
  if (!updatedUser) {
    throw 'could not update product successfully';
  }
  const shopCollection = await shops();
  const updatedShop = await shopCollection.findOneAndUpdate(
    {_id: new ObjectId(obj._id)},
    {$set: obj},
    {returnDocument: 'after'}
  );
  if (!updatedShop) {
    throw 'could not update product successfully';
  }
  return updatedUser
}

const removeReview = async (reviewId) => {
  reviewId = valid.idCheck(reviewId)
  const review = await this.getReview(reviewId)
  const userCollection = await users();
  const updatedUser = await userCollection.findOneAndUpdate(
    { 'reviews._id': new ObjectId(reviewId) },
    { $pull: { reviews: { _id: new ObjectId(reviewId) } } },
    { returnDocument: 'after' }
  );
  if(!updatedUser){
    throw 'could not delete'
  }
  review.objId = valid.idCheck(review.objId)
  const shopCollection = await shops()
  const shop = shopData.getShop(review.objId)
  const index = shop.reviews.indexOf(reviewId);
  if (index !== -1) {
    shop.reviews.splice(index, 1);
  }
  let len = shop.reviews.length
  if(len !== 0){
    shop.averageRating = ((shop.averageRating*(len+1))-review.rating)/len
  }
  else{
    shop.averageRating = 0
  }
  const updatedShop = await shopCollection.findOneAndUpdate(
    {_id: new ObjectId(review.objId)},
    {$set: shop},
    {returnDocument: 'after'}
  )
  return updatedUser
}

const exportedMethods = {
  getAllReviewsFromUser,
  getAllReviewsForShop,
  createReview,
  updateReview,
  getReview,
  removeReview
}
export default exportedMethods;