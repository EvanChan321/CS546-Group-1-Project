import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import userData from "../data/users.js";
import shopData from "../data/shops.js"
import reviewData from "../data/reviews.js"
import commentData from "../data/comments.js"
import * as valid from "../valid.js";

const db = await dbConnection();
await db.collection("users").drop();
await db.collection("shops").drop();

let user = {
    name: "Tabby",
    password: "Password1!",
    email: "mangelak@stevens.edu",
    zipcode: "07630",
    accountType: "Default",
}

let shop = {
    name: "Chicken Factory",
    address: "529 Washington St, Hoboken, NJ, 070",
    website: "google.com",
    phoneNumber: "2018199192",
}

let review = {
    title: "peak",
    rating: 5,
    review: "this is good"
}

let review2 = {
    title: "ass",
    rating: 1,
    review: "this is bad"
}

let comment = {
    comment: "GOAT"
}
let comment2 = {
    comment: "ur buggin"
}
try {
    user = await userData.createUser(
        user.name,
        user.password,
        user.email,
        user.zipcode,
        user.accountType
    );
    console.log("user created");
    console.log(user);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

try {
    shop = await shopData.createShop(
        shop.name,
        shop.address,
        shop.website,
        shop.phoneNumber,
    );
    console.log("shop created");
    console.log(shop);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

try{
    review = await reviewData.createReview(
        user._id.toString(),
        shop._id.toString(),
        review.title,
        review.rating,
        review.review
    )
    console.log("review created");
    console.log(review);
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    review2 = await reviewData.createReview(
        user._id.toString(),
        shop._id.toString(),
        review2.title,
        review2.rating,
        review2.review
    )
    console.log("review created");
    console.log(review2);
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user._id.toString(),
        review._id.toString(),
        comment.comment
    )
    console.log("comment created");
    console.log(comment);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    comment2 = await commentData.createComment(
        user._id.toString(),
        review2._id.toString(),
        comment2.comment
    )
    console.log("comment created");
    console.log(comment2);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    console.log(await userData.getAllUsers())
}
catch(e){
    console.log("Error listings users");
    console.log(e);
}

try{
    console.log(await shopData.getAllShops())
}
catch(e){
    console.log("Error listings shops");
    console.log(e);
}

try{
    console.log(await reviewData.getReview(review._id.toString()))
}
catch(e){
    console.log("Error listings shops");
    console.log(e);
}

try{
    console.log(await commentData.getAllCommentsFromUser(user._id.toString()))
}
catch(e){
    console.log("Error listings shops");
    console.log(e);
}

await closeConnection();