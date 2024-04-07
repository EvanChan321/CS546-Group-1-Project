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
  shopId = valid.idCheck(shopId)
  shopData(shopId)
  const users = await userData.getAllUsers();
  let reviews = []
  users.forEach(user => {
    user.reviews.forEach(review => {
      if (review.objId === shopId) {
        reviews = reviews.concat(review);
      }
  })});
  return reviews;
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
  const shopForReview = await shopData.getShop(objId)
  objId = valid.idCheck(userId)
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
    reviewDate: currentDateString
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

const exportedMethods = {
  getAllReviewsFromUser,
  getAllReviewsForShop,
  createReview,
  getReview
}
export default exportedMethods;