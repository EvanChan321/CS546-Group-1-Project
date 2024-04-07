import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import userData from './users.js';
import reviewData from './reviews.js'

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
    userId: userId,
    username: userComment.name,
    comment: comment,
    reviewDate: currentDateString
  }
  reviewComment.push(newComment)
  await reviewData.updateReview(reviewId, reviewComment)
  return newComment;
}

const exportedMethods = {
    getAllCommentsFromUser,
    getAllCommentsFromReview,
    createComment,
    getComment
}
export default exportedMethods;