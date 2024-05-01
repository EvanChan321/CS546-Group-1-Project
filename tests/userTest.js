import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import { commentData, reviewData, userData, shopData, itemData, flagData } from "../data/index.js";
import * as valid from "../valid.js";

const db = await dbConnection();
await db.collection("users").drop();
await db.collection("shops").drop();

let user = {
    name: "Tabby",
    password: "Password1!",
    email: "mangelak@stevens.edu",
    zipcode: "Emerson, NJ",
    accountType: "Admin",
    themeType: 'light'
}

let userErr = {
    name: "tabby",
    password: "Password1!",
    email: "mangelakos@stevens.edu",
    zipcode: "076300",
    accountType: "Admin",
    themeType: 'light'
}

let userErr2 = {
    name: "totallyNotTabby",
    password: "Password1!",
    email: "mangelak@stevens.edu",
    zipcode: "076300",
    accountType: "user",
    themeType: 'light'
}

let user2 = {
    name: "Denks",
    password: "ILoveCS546!!!",
    email: "eniemann@stevens.edu",
    zipcode: "Saint Louis",
    accountType: "Default",
    themeType: 'light'
}

let user3 = {
    name: "PlayboiCarti",
    password: "Go2DaMoon$",
    email: "playboicarti@rocketmail.com",
    zipcode: "Peachtree St, Atlanta",
    accountType: "Default",
    themeType: 'light'
}

let user4 = {
    name: "AmazinBuilder",
    password: "#1Builder",
    email: "amazin@hotmail.com",
    zipcode: "30 Wayne Hills Mall, Wayne",
    accountType: "Default",
    themeType: 'light'
}

let user5 = {
    name: "TheHoohn",
    password: "Password3#",
    email: "actronav@gmail.com",
    zipcode: "Fort Lee, NJ",
    accountType: "Business",
    themeType: 'light'
}

let shop = {
    name: "Chicken Factory",
    address: "529 Washington St, Hoboken, NJ, 07030",
    website: "http://www.chickenfactoryhoboken.com/",
    phoneNumber: "201-683-8243",
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
    comment: "jumpoutthehouse"
}

try {
    user = await userData.createUser(
        user.name,
        user.password,
        user.email,
        user.zipcode,
        user.accountType,
        user.themeType
    );
    console.log("user created");
    console.log(user);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

try {
    userErr = await userData.createUser(
        userErr.name,
        userErr.password,
        userErr.email,
        userErr.zipcode,
        userErr.accountType,
        userErr.themeType
    );
    console.log("user incorrectly created");
    console.log(userErr);
} catch (e) {
    console.log("Correctly errored user");
    console.log(e);
}

try {
    userErr = await userData.createUser(
        userErr2.name,
        userErr2.password,
        userErr2.email,
        userErr2.zipcode,
        userErr2.accountType,
        userErr2.themeType
    );
    console.log("user incorrectly created");
    console.log(userErr);
} catch (e) {
    console.log("Correctly errored user");
    console.log(e);
}

try {
    user2 = await userData.createUser(
        user2.name,
        user2.password,
        user2.email,
        user2.zipcode,
        user2.accountType,
        user2.themeType
    );
    console.log("user created");
    console.log(user2);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

try {
    user3 = await userData.createUser(
        user3.name,
        user3.password,
        user3.email,
        user3.zipcode,
        user3.accountType,
        user3.themeType
    );
    console.log("user created");
    console.log(user3);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

try {
    user4 = await userData.createUser(
        user4.name,
        user4.password,
        user4.email,
        user4.zipcode,
        user4.accountType,
        user4.themeType
    );
    console.log("user created");
    console.log(user4);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

try {
    user5 = await userData.createUser(
        user5.name,
        user5.password,
        user5.email,
        user5.zipcode,
        user5.accountType,
        user5.themeType
    );
    console.log("user created");
    console.log(user5);
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
        "12",
        "0",
        "AM",
        "12",
        "0",
        "PM",
        user5._id.toString()
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
        review.review,
        'shop'
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
        review2.review,
        'shop'
    )
    console.log("review incorrectly created");
    console.log(review2);
}
catch(e){
    console.log("Correctly errored review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user2._id.toString(),
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
        user3._id.toString(),
        review._id.toString(),
        comment2.comment
    )
    console.log("comment created");
    console.log(comment);
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

/*try{
    const data = await shopData.removeShop(shop._id.toString())
    console.log(data)
}
catch(e){
    console.log("Error listings shops");
    console.log(e);
}*/

/*try{
    const data = await userData.removeUser(user._id.toString())
    console.log(data)
}
catch(e){
    console.log("Error listings shops");
    console.log(e);
}*/

let shop2 = {
    name: "Kung Fu Tea",
    address: "536 Washington St, Hoboken, NJ, 07030",
    website: "https://www.kungfutea.com/",
    phoneNumber: "201-222-9091",
}

try {
    shop2 = await shopData.createShop(
        shop2.name,
        shop2.address,
        shop2.website,
        shop2.phoneNumber,
        "12",
        "0",
        "AM",
        "12",
        "0",
        "PM"
    );
    console.log("shop created");
    console.log(shop2);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let shop3 = {
    name: "ViVi Bubble Tea",
    address: "117 Washington St, Hoboken, NJ, 07030",
    website: "https://www.vivihoboken.com/",
    phoneNumber: "201-626-3889",
}

try {
    shop3 = await shopData.createShop(
        shop3.name,
        shop3.address,
        shop3.website,
        shop3.phoneNumber,
        "12",
        "0",
        "AM",
        "12",
        "0",
        "PM"
    );
    console.log("shop created");
    console.log(shop3);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let shop4 = {
    name: "Gong Cha",
    address: "527 Washington St, Hoboken, NJ, 07030",
    website: "https://gongchausa.com/",
    phoneNumber: "201-710-5757",
}

try {
    shop4 = await shopData.createShop(
        shop4.name,
        shop4.address,
        shop4.website,
        shop4.phoneNumber,
        "12",
        "0",
        "AM",
        "12",
        "0",
        "PM"
    );
    console.log("shop created");
    console.log(shop4);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let shop5 = {
    name: "The Whale Tea",
    address: "303 1st St, Hoboken, NJ, 07030",
    website: "https://www.whaleteausa.com/",
    phoneNumber: "201-253-0168",
}

try {
    shop5 = await shopData.createShop(
        shop5.name,
        shop5.address,
        shop5.website,
        shop5.phoneNumber,
        "12",
        "0",
        "AM",
        "12",
        "0",
        "PM"
    );
    console.log("shop created");
    console.log(shop5);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let review3 = {
    title: "Questionable",
    rating: 4,
    review: "The tea was just alright, but very good service"
}

try{
    review3 = await reviewData.createReview(
        user2._id.toString(),
        shop3._id.toString(),
        review3.title,
        review3.rating,
        review3.review,
        'shop'
    )
    console.log("review created");
    console.log(review);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let review4 = {
    title: "AHH",
    rating: 1,
    review: "They put peanut, tree nuts, sesame, and mustard in my tea!"
}

try{
    review4 = await reviewData.createReview(
        user4._id.toString(),
        shop2._id.toString(),
        review4.title,
        review4.rating,
        review4.review,
        'shop'
    )
    console.log("review created");
    console.log(review4);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user2._id.toString(),
        review4._id.toString(),
        "I'm sorry to hear that"
    )
    console.log("comment created");
    console.log(comment);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}


let review5 = {
    title: "Pretty Good",
    rating: 5,
    review: "They made sure to put in the special sauce"
}

try{
    review5 = await reviewData.createReview(
        user4._id.toString(),
        shop3._id.toString(),
        review5.title,
        review5.rating,
        review5.review,
        'shop'
    )
    console.log("review created");
    console.log(review5);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user._id.toString(),
        review5._id.toString(),
        "What is the special sauce..."
    )
    console.log("comment created");
    console.log(comment);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user4._id.toString(),
        review5._id.toString(),
        "That's a secret!"
    )
    console.log("comment created");
    console.log(comment);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    review = await reviewData.createReview(
        user3._id.toString(),
        shop4._id.toString(),
        "carti",
        3,
        "i <3 tHis pLAc3",
        'shop'
    )
    console.log("review created");
    console.log(review);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user4._id.toString(),
        review._id.toString(),
        "Me too!"
    )
    console.log("comment created");
    console.log(comment);
} catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user._id.toString(),
        review._id.toString(),
        "I don't!"
    )
    console.log("comment created");
    console.log(comment);
} catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    review = await reviewData.createReview(
        user2._id.toString(),
        shop5._id.toString(),
        "it's okay...",
        3,
        "Nothing special really, mid tea, ok service",
        'shop'
    )
    console.log("review created");
    console.log(review);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user._id.toString(),
        review._id.toString(),
        "Nah, ur trolling"
    )
    console.log("comment created");
    console.log(comment);
} catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        user2._id.toString(),
        review._id.toString(),
        "??? No I'm not"
    )
    console.log("comment created");
    console.log(comment);
} catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    review = await reviewData.createReview(
        user._id.toString(),
        shop5._id.toString(),
        "Hidden gem",
        5,
        "I never heard of this place until the other day but it's great",
        'shop'
    )
    console.log("review created");
    console.log(review);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}


try{
    await reviewData.removeReview(review._id.toString())
    console.log("review removed");
}catch (e) {
    console.log("Error removing review");
    console.log(e);
}
let flag
try{
    flag = await flagData.createFlag(shop5._id.toString(), user._id.toString(), "bruh")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    console.log(await flagData.getFlag(flag._id.toString()))
}
catch(e){
    console.log("Error finding flag");
    console.log(e);
}

try{
    flag = await flagData.deleteFlag(flag._id.toString())
    console.log("flag removed");
}catch (e) {
    console.log("Error removing flag");
    console.log(e);
}

let item
try{
    item = await itemData.createItem(shop._id.toString(), "Winston's Drink", "Winston's Drink that is made with his Special Sauce!", 420.69, ["strawberry", "tapioca", "jelly", "iced", "milk"], ["gluten"])
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}
let review6
try{
    review6 = await reviewData.createReview(user._id.toString(), item._id.toString(), "WOW", 5, "Its great!", "item")
    console.log("item review created");
    console.log(review6)
}catch (e) {
    console.log("Error making item review");
    console.log(e);
}

/*try{
    item = await itemData.createItem(
        shop._id.toString(),
        "Taro Milk Tea",
        "Taro Flavored Milk Tea",
        4,
        ["Milk Tea","Hot"],
        ["Dairy"]        
    )
} catch(e){
    console.log("Error making item");
    console.log(e);
}*/
await closeConnection();