import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import userData from './users.js';
import reviewData from './reviews.js'
import { commentData } from "./index.js";

const getAllCommentsFromUser = async (userId) => {
    userId = valid.idCheck(userId)
    const user = await userData.getUser(userId);
    let comments = [];
    user.reviews.forEach(review => {
        if (review.comments) {
            comments = comments.concat(review.comments);
        }
    });
    return comments;
}

const getAllCommentsFromReview = async (reviewId) => {
    userId = valid.idCheck(reviewId)
    const review = await reviewData.getReview(reviewId);
    return review.comments
}

const getComment = async (commentId) => {
    commentId = valid.idCheck(commentId)
    const userCollection = await users();
    const foundUser = await userCollection.findOne(
      { 'reviews.comments._id': new ObjectId(commentId) }
    );
    if(!foundUser){
      throw 'cant find user'
    }
    const comment = foundUser.reviews.comments.find(comment => comment._id.equals(new ObjectId(commentId)));
    if (!comment) {
      throw 'cannot find review';
    }
    //foundReview._id = foundReview._id.toString();
    return comment
}

const createComment = async (userId, reviewId, comment) => {
  const userComment = await userData.getUser(userId)
  const reviewComment = await reviewData.getReview(reviewId)
  comment = valid.stringValidate(comment)
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  let x = new ObjectId();
  const newComment = {
    _id: x,
    userId: userComment._id,
    comment: reviewComment,
    reviewDate: currentDateString
  }
  reviewComment.push(newComment)
  await reviewData.updateReview(reviewId, reviewComment)
  return newComment;
}

const updateComment = async (userId, commentId, updateObject) => {
  const comment = await commentData.getComment(commentId)
  if('comment' in updateObject){
    updateObject.comment = valid.stringValidate(updateObject.comment)
    comment.comment = updateObject.comment
    const currentDate = new Date();
    const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    comment.currentDateString = currentDateString
    const shopCollection = await shops();
    const updatedInfo = await shopCollection.findOneAndUpdate(
      { 'reviews.comments._id': new ObjectId(commentId) },
      { $set: { 'flags.$': comment } },
      {returnDocument: 'after'}
    );
    return updatedInfo
  }
  throw "no actual update"
}

const exportedMethods = {
    getAllCommentsFromUser,
    getAllCommentsFromReview,
    createComment,
    getComment,
    updateComment
}
export default exportedMethods;