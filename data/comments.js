import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import userData from './users.js';
import reviewData from './reviews.js'

const getAllCommentsFromUser = async (userId) => {
    userId = valid.idCheck(userId)
    const user = await userData.getUser(userId);
    let comments = []
    let currComm
    user.comments.forEach( async commentId => {
      currComm = await getComment(commentId)
      comments.concat(currComm)
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
    comment: comment,
    reviewDate: currentDateString
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