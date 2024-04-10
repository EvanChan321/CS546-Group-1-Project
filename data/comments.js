import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import userData from './users.js';
import reviewData from './reviews.js'

const getAllCommentsFromUser = async (userId) => {
    console.log(userId)
    const user = await userData.getUser(userId);
    let comments = []
    await Promise.all(user.comments.map(async (commentId) => {
      const currComm = await getComment(commentId.toString());
      comments = comments.concat(currComm);
    }));
    return comments;
}

const getAllCommentsFromReview = async (reviewId) => {
  reviewId = valid.idCheck(reviewId)
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
      throw 'User not found';
    }
    if (!foundUser.reviews) {
      throw 'User has no reviews';
    }
    console.log(foundUser)
    let foundComment = null
    for (let i = 0; i < foundUser.reviews.length; i++) {
      const review = foundUser.reviews[i]
      const comment = review.comments.find(comment => comment._id.toString() === commentId)
      if (comment) {
        foundComment = comment
        break
      }
    }
    if (foundComment === null) {
      throw 'Comment not found';
    }
    return foundComment;
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
    comment: comment,
    reviewDate: currentDateString,
    edited: false
  }
  reviewComment.comments.push(newComment)
  userComment.comments.push(x)
  await userData.updateUser(userComment._id.toString(), userComment)
  await reviewData.updateReview(reviewComment._id.toString(), reviewComment)
  return newComment;
}

const updateComment = async (commentId, updateObject) => {
  const comment = await commentData.getComment(commentId)
  if('comment' in updateObject){
    updateObject.comment = valid.stringValidate(updateObject.comment)
    comment.comment = updateObject.comment
    const currentDate = new Date();
    const currentDateString = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    comment.currentDateString = currentDateString
    comment.edited = true
    const userCollection = await userCollection();
    const updatedInfo = await userCollection.findOneAndUpdate(
      { 'reviews.comments._id': new ObjectId(commentId) },
      { $set: { 'reviews.comments.$': comment } },
      {returnDocument: 'after'}
    );
    return updatedInfo
  }
  throw "no actual update"
}

const removeComment = async (commentId) => {
  commentId = valid.idCheck(commentId)
  const comment = await this.getComment(commentId)
  const userCollection = await users();
  const updatedInfo = await userCollection.findOneAndUpdate(
    { 'reviews.comments._id': new ObjectId(commentId) },
    { $pull: { 'reviews.comments': { _id: new ObjectId(commentId) } } },
    { returnDocument: 'after' }
  );
  if(!updatedInfo){
    throw 'could not delete'
  }
  return updatedInfo
}

const exportedMethods = {
    getAllCommentsFromUser,
    getAllCommentsFromReview,
    createComment,
    getComment,
    updateComment,
    removeComment
}
export default exportedMethods;