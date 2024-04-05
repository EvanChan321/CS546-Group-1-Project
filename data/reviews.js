import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import userData from './users.js';
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";

const getAllReviewsFromUser = async (userId) => {
    userId = valid.idCheck(userId)
    const user = await userData.get(productId);
    return user.reviews
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

const exportedMethods = {
}
export default exportedMethods;