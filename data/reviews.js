import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import userData from './users.js';
import shopData from './shops.js';
import { itemData } from "./index.js";

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
    return review
}

const createReview = async (userId, objId, title, rating, review, type) => {
  userId = valid.idCheck(userId)
  const userReview = await userData.getUser(userId)
  title = valid.stringValidate(title)
  objId = valid.idCheck(objId)
  let objForReview
  if(type === 'shop'){
    objForReview = await shopData.getShop(objId)
  }
  else if(type === 'item'){
    objForReview = await itemData.getItem(objId)
  }
  valid.numCheck(rating)
  valid.intCheck(rating)
  review = valid.stringValidate(review)
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  let x = new ObjectId();
  const newReview = {
    _id: x,
    objId: new ObjectId(objId),
    userId: userId,
    user: userReview.name,
    title: title,
    rating: rating,
    review: review,
    reviewDate: currentDateString,
    comments: [],
    edited: false,
    type: type
  }
  const existingReview = userReview.reviews.find((review) => review.objId.toString() == newReview.objId.toString());
  if(existingReview) throw `User has already made review for this ${type}`;
  userReview.reviews.push(newReview)
  objForReview.reviews.push(x)
  const len = objForReview.reviews.length
  if(len == 1){
    objForReview.averageRating = newReview.rating
  }
  else{
    objForReview.averageRating = ((objForReview.averageRating*(len-1))+newReview.rating)/len
  }
  const shopCollection = await shops();
  const userCollection = await users();
  const userUpdatedInfo = await userCollection.findOneAndUpdate(
    {_id: new ObjectId(userId)},
    {$set: userReview},
    {returnDocument: 'after'}
  )
  if (!userUpdatedInfo) {
    throw 'could not update user successfully';
  }
  if(type === 'shop'){
    const shopUpdatedInfo = await shopCollection.findOneAndUpdate(
      {_id: new ObjectId(objId)},
      {$set: objForReview},
      {returnDocument: 'after'}
    )
    if (!shopUpdatedInfo) {
      throw 'could not update shop successfully';
    }
  }
  else if(type === 'item'){
    const updatedInfo = await shopCollection.findOneAndUpdate(
      { 'items._id': new ObjectId(objId) },
      { $set: { 'items.$': objForReview } },
      {returnDocument: 'after'}
    );
    if (!updatedInfo) {
      throw 'could not update item successfully';
    }
  }
  return newReview;
}

const updateReview = async (reviewId, updateObject, type) => {
  const review = await getReview(reviewId)
  let obj
  if(type === "item"){
    obj = await itemData.getItem(review.objId.toString())
  }
  else{
    obj = await shopData.getShop(review.objId.toString())
  }
  if('title' in updateObject){
    updateObject.title = valid.stringValidate(updateObject.title)
    review.title = updateObject.title
  }
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
  if('comments' in updateObject){
    review.comments = updateObject.comments
  }
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  review.reviewDate = currentDateString
  if('edited' in updateObject){
    review.edited = updateObject.edited
  }
  const userCollection = await users();
  const updatedUser = await userCollection.findOneAndUpdate(
    { 'reviews._id': new ObjectId(reviewId) },
    { $set: { 'reviews.$': review } },
    {returnDocument: 'after'}
  );
  if (!updatedUser) {
    throw 'could not update product successfully';
  }
  const shopCollection = await shops();
  let updatedInfo
  if(type === "item"){
    updatedInfo = await shopCollection.findOneAndUpdate(
      { 'items._id': review.objId },
      { $set: { 'items.$': obj } },
      {returnDocument: 'after'}
    )
  }
  else{
    updatedInfo = await shopCollection.findOneAndUpdate(
      {_id: new ObjectId(obj._id)},
      {$set: obj},
      {returnDocument: 'after'}
    ); 
  }
  if (!updatedInfo) {
    throw 'could not update obj successfully';
  }
  return review
}

const removeReview = async (reviewId) => {
  reviewId = valid.idCheck(reviewId)
  const review = await getReview(reviewId)
  const userCollection = await users();
  const updatedUser = await userCollection.findOneAndUpdate(
    { 'reviews._id': new ObjectId(reviewId) }, 
    { $pull: { reviews: { _id: new ObjectId(reviewId) } } },
    {returnDocument: 'after'} 
  );
  if(!updatedUser){
    throw 'could not delete'
  }
  review.objId = valid.idCheck(review.objId.toString())
  const shopCollection = await shops()
  let shop
  function findIndexById(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].equals(id)) { 
            return i;
        }
    }
    return i; 
  }
  if(review.type === "item"){
    shop = await itemData.getItem(review.objId.toString())
  }
  else{
    shop = await shopData.getShop(review.objId.toString())
  }
  const index = findIndexById(shop.reviews, new ObjectId(reviewId))
  if (index !== -1) {
    shop.reviews.splice(index, 1);
  }
  let len = shop.reviews.length
  if(len !== 0){
    shop.averageRating = ((shop.averageRating*(len+1))-review.rating)/len
  }
  else{
    shop.averageRating = "No Ratings"
  }
  if(review.type === "item"){
    const updatedInfo = await shopCollection.findOneAndUpdate(
      { 'items._id': new ObjectId(review.objId) },
      { $set: { 'items.$': shop } },
      {returnDocument: 'after'}
    )
  }
  else{
    const updatedShop = await shopCollection.findOneAndUpdate(
      {_id: new ObjectId(review.objId)},
      {$set: shop},
      {returnDocument: 'after'}
    )
  }
  await review.comments.forEach(async comment => {
    let updatedUserComment = await userCollection.findOneAndUpdate(
      { comments: new ObjectId(comment._id) }, 
      { $pull: { comments: new ObjectId(comment._id) } },
      {returnDocument: 'after'} 
    );
  });
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