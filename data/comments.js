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

const exportedMethods = {
    getAllCommentsFromUser,
    getAllCommentsFromReview,
    getComment
}
export default exportedMethods;