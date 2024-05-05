import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import { commentData, reviewData, userData, shopData, itemData, flagData } from "../data/index.js";
import * as valid from "../valid.js";

const db = await dbConnection();
await db.collection("users").drop();
await db.collection("shops").drop();

let customization = {
    size_options: true,
    ice_level: true,
    sugar_level: true,
    customization_charge: false
}

// User 1
let tabby = {
    name: "Tabby",
    password: "Password1!",
    email: "mangelak@stevens.edu",
    zipcode: "Emerson, NJ",
    accountType: "Default",
    themeType: 'light'
}

try {
    tabby = await userData.createUser(
        tabby.name,
        tabby.password,
        tabby.email,
        tabby.zipcode,
        tabby.accountType,
        tabby.themeType
    );
    console.log("user created");
    console.log(tabby);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 2

let denks = {
    name: "Denks",
    password: "ILoveCS546!!!",
    email: "eniemann@stevens.edu",
    zipcode: "Saint Louis",
    accountType: "Default",
    themeType: 'light'
}

try {
    denks = await userData.createUser(
        denks.name,
        denks.password,
        denks.email,
        denks.zipcode,
        denks.accountType,
        denks.themeType
    );
    console.log("user created");
    console.log(denks);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 3

let carti = {
    name: "PlayboiCarti",
    password: "Go2DaMoon$",
    email: "playboicarti@rocketmail.com",
    zipcode: "Peachtree St, Atlanta",
    accountType: "Default",
    themeType: 'dark'
}

try {
    carti = await userData.createUser(
        carti.name,
        carti.password,
        carti.email,
        carti.zipcode,
        carti.accountType,
        carti.themeType
    );
    console.log("user created");
    console.log(carti);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// user 4

let amazin = {
    name: "AmazinBuilder",
    password: "#1Builder",
    email: "amazin@hotmail.com",
    zipcode: "30 Wayne Hills Mall, Wayne",
    accountType: "Default",
    themeType: 'light'
}

try {
    amazin = await userData.createUser(
        amazin.name,
        amazin.password,
        amazin.email,
        amazin.zipcode,
        amazin.accountType,
        amazin.themeType
    );
    console.log("user created");
    console.log(amazin);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 5

let hoohn = {
    name: "TheHoohn",
    password: "Password3#",
    email: "actronav@gmail.com",
    zipcode: "Fort Lee, NJ",
    accountType: "Business",
    themeType: 'light'
}

try {
    hoohn = await userData.createUser(
        hoohn.name,
        hoohn.password,
        hoohn.email,
        hoohn.zipcode,
        hoohn.accountType,
        hoohn.themeType
    );
    console.log("user created");
    console.log(hoohn);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 6

let CP = {
    name: "Krispy",
    password: "Password1!",
    email: "carias1@gmail.com",
    address: "Princeton, NJ",
    accountType: "Default",
    themeType: 'dark'
}

try {
    CP = await userData.createUser(
        CP.name,
        CP.password,
        CP.email,
        CP.address,
        CP.accountType,
        CP.themeType
    );
    console.log("user created");
    console.log(CP);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 7

let rumy
try {
    rumy = await userData.createUser(
        "redrumy",
        "Password1!",
        "knakano@stevens.edu",
        "Rockaway, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(rumy);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 8

let yap
try {
    yap = await userData.createUser(
        "yap",
        "Password1!",
        "myap@stevens.edu",
        "Hoboken, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(yap);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 9

let tiantao
try {
    tiantao = await userData.createUser(
        "tiantao",
        "Password1!",
        "echeng2@stevens.edu",
        "Edison, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(tiantao);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// User 10

let realass
try {
    realass = await userData.createUser(
        "realass",
        "Password1!",
        "carias1@stevens.edu",
        "Brick, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(realass);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// oolong item

let oolong = {
    title: "Oolong Tea",
    description: "The finest tea, perfect for both sweet and non-sweet enjoyers",
    price: 5.99,
    tags: ["honey", "tapioca", "jelly", "iced", "milk", "malted"],
    allergens: ["Dairy"]
}

/// taro item

let taroMT = {
    title: "Taro Milk Tea",
    description: "Taro flavored milk tea.",
    price: 4.99,
    tags: ["Milk Tea", "Hot"],
    allergens: ["Dairy"]
}

// brown sugar item

let bsMT = {
    title: "Brown Sugar Milk Tea",
    description: "Sweet milk tea with brown sugar",
    price: 6.99,
    tags: ["Sweet", "Milk Tea", "Sugar", "Brown Sugar"],
    allergens: ["Dairy"]
}

// Chicken Factory

let shop = {
    name: "Chicken Factory",
    address: "529 Washington St, Hoboken, NJ, 07030",
    website: "http://www.chickenfactoryhoboken.com/",
    phoneNumber: "201-683-8243",
}

try {
    shop = await shopData.createShop(
        shop.name,
        shop.address,
        shop.website,
        shop.phoneNumber,
        "11",
        "00",
        "AM",
        "9",
        "30",
        "PM",
        customization,
        hoohn._id.toString()
    );
    console.log("shop created");
    console.log(shop);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let tabbyReview1 = {
    title: "peak",
    rating: 5,
    review: "this is good",
    user: tabby
}

try{
    tabbyReview1 = await reviewData.createReview(
        tabbyReview1.user._id.toString(),
        shop._id.toString(),
        tabbyReview1.title,
        tabbyReview1.rating,
        tabbyReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(tabbyReview1);
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

let tiantaoReview1 = {
    title: "Ehhh",
    rating: 2,
    review: "Could be better, I like kung fu tea more",
    user: tiantao
}

try{
    tiantaoReview1 = await reviewData.createReview(
        tiantaoReview1.user._id.toString(),
        shop._id.toString(),
        tiantaoReview1.title,
        tiantaoReview1.rating,
        tiantaoReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(tiantaoReview1);
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

let realassReview1 = {
    title: "#blessed",
    rating: 4,
    review: "My buddy Ha Chung Hoohn recommended this place to me! It's great!",
    user: realass
}

try{
    realassReview1 = await reviewData.createReview(
        realassReview1.user._id.toString(),
        shop._id.toString(),
        realassReview1.title,
        realassReview1.rating,
        realassReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(realassReview1);
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

let yapReview1 = {
    title: "HYPE",
    rating: 4,
    review: "love that you can get both food and boba here",
    user: yap
}

try{
    yapReview1 = await reviewData.createReview(
        yapReview1.user._id.toString(),
        shop._id.toString(),
        yapReview1.title,
        yapReview1.rating,
        yapReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(yapReview1);
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

// let tabbyReview2 = {
//     title: "ass",
//     rating: 1,
//     review: "this is bad",
//     user: tabby
// }

// try{
//     tabbyReview2 = await reviewData.createReview(
//         tabbyReview2.user._id.toString(),
//         shop._id.toString(),
//         tabbyReview2.title,
//         tabbyReview2.rating,
//         tabbyReview2.review,
//         'shop'
//     )
//     console.log("review incorrectly created");
//     console.log(tabbyReview2);
// }
// catch(e){
//     console.log("Correctly errored review");
//     console.log(e);
// }

let comment = {
    comment: "GOAT"
}

try{
    comment = await commentData.createComment(
        denks._id.toString(),
        tabbyReview1._id.toString(),
        comment.comment
    )
    console.log("comment created");
    console.log(comment);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}

let comment2 = {
    comment: "jumpoutthehouse"
}

try{
    comment2 = await commentData.createComment(
        carti._id.toString(),
        tabbyReview1._id.toString(),
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
    comment = await commentData.createComment(
        amazin._id.toString(),
        tabbyReview1._id.toString(),
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
        tabby._id.toString(),
        tabbyReview1._id.toString(),
        "I don't!"
    )
    console.log("comment created");
    console.log(comment);
} catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        tabby._id.toString(),
        tabbyReview1._id.toString(),
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
        denks._id.toString(),
        tabbyReview1._id.toString(),
        "??? No I'm not"
    )
    console.log("comment created");
    console.log(comment);
} catch(e){
    console.log("Error creating comment");
    console.log(e);
}

let item
try{
    item = await itemData.createItem(
        shop._id.toString(), 
        "Winston's Drink", 
        "Winston's Drink that is made with his Special Sauce!", 
        420.69, 
        ["strawberry", "tapioca", "jelly", "iced", "milk"], 
        ["gluten"],
        128
    )
    console.log("item created");
    // console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shop._id.toString(),
        taroMT.title,
        taroMT.description,
        taroMT.price,
        taroMT.tags,
        taroMT.allergens,
        876
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

let itemReview1 = {
    title: "WOW",
    rating: 5,
    review: "It's great!",
    user: tabby
}

try{
    itemReview1 = await reviewData.createReview(
        itemReview1.user._id.toString(), 
        item._id.toString(), 
        itemReview1.title, 
        itemReview1.rating, 
        itemReview1.review, 
        "item"
    )
    console.log("item review created");
    console.log(itemReview1)
}catch (e) {
    console.log("Error making item review");
    console.log(e);
}

// end of chicken factory
// Kung Fu Tea

let kft = {
    name: "Kung Fu Tea",
    address: "536 Washington St, Hoboken, NJ, 07030",
    website: "https://www.kungfutea.com/",
    phoneNumber: "201-222-9091",
}

try {
    kft = await shopData.createShop(
        kft.name,
        kft.address,
        kft.website,
        kft.phoneNumber,
        "11",
        "0",
        "AM",
        "9",
        "30",
        "PM",
        customization
    );
    console.log("shop created");
    console.log(kft);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let amazinReview1 = {
    title: "AHH",
    rating: 1,
    review: "They put peanut, tree nuts, sesame, and mustard in my tea!",
    user: amazin
}

try{
    amazinReview1 = await reviewData.createReview(
        amazinReview1.user._id.toString(),
        kft._id.toString(),
        amazinReview1.title,
        amazinReview1.rating,
        amazinReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(amazinReview1);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let rumyReview1 = {
    title: "A Classic",
    rating: 5,
    review: "The most popular boba spot in hoboken for a reason!",
    user: rumy
}

try{
    rumyReview1 = await reviewData.createReview(
        rumyReview1.user._id.toString(),
        kft._id.toString(),
        rumyReview1.title,
        rumyReview1.rating,
        rumyReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(rumyReview1);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let realassReview2 = {
    title: "PEAK",
    rating: 5,
    review: "Even their coffee is good, of course this place is goated",
    user: realass
}

try{
    realassReview2 = await reviewData.createReview(
        realassReview2.user._id.toString(),
        kft._id.toString(),
        realassReview2.title,
        realassReview2.rating,
        realassReview2.review,
        'shop'
    )
    console.log("review created");
    console.log(realassReview2);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let tiantaoReview2 = {
    title: "THE MECCA",
    rating: 5,
    review: "I LOVE KFT WOOOOOOOO!",
    user: tiantao
}

try{
    tiantaoReview2 = await reviewData.createReview(
        tiantaoReview2.user._id.toString(),
        kft._id.toString(),
        tiantaoReview2.title,
        tiantaoReview2.rating,
        tiantaoReview2.review,
        'shop'
    )
    console.log("review created");
    console.log(tiantaoReview2);
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        denks._id.toString(),
        amazinReview1._id.toString(),
        "I'm sorry to hear that"
    )
    console.log("comment created");
    console.log(comment);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}

try{
    item = await itemData.createItem(
        kft._id.toString(),
        oolong.title,
        oolong.description,
        oolong.price,
        oolong.tags,
        oolong.allergens,
        180
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        kft._id.toString(),
        taroMT.title,
        taroMT.description,
        taroMT.price,
        taroMT.tags,
        taroMT.allergens,
        801 
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        kft._id.toString(),
        "Espresso Thai Tea",
        "Thai Tea mixed with Espresso",
        6.99,
        ["hot", "iced", "espresso", "hot", "iced"],
        [],
        241
    );
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

// Vivi's

let vivi = {
    name: "ViVi Bubble Tea",
    address: "117 Washington St, Hoboken, NJ, 07030",
    website: "https://www.vivihoboken.com/",
    phoneNumber: "201-626-3889",
}

try {
    vivi = await shopData.createShop(
        vivi.name,
        vivi.address,
        vivi.website,
        vivi.phoneNumber,
        "11",
        "0",
        "AM",
        "9",
        "0",
        "PM",
        customization
    );
    console.log("shop created");
    console.log(vivi);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let denksReview1 = {
    title: "Questionable",
    rating: 4,
    review: "The tea was just alright, but very good service",
    user: denks
}

try{
    denksReview1 = await reviewData.createReview(
        denksReview1.user._id.toString(),
        vivi._id.toString(),
        denksReview1.title,
        denksReview1.rating,
        denksReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(denksReview1);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let amazinReview2 = {
    title: "Pretty Good",
    rating: 5,
    review: "They made sure to put in the special sauce",
    user: amazin
}

try{
    amazinReview2 = await reviewData.createReview(
        amazinReview2.user._id.toString(),
        vivi._id.toString(),
        amazinReview2.title,
        amazinReview2.rating,
        amazinReview2.review,
        'shop'
    )
    console.log("review created");
    console.log(amazinReview2);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let yapReview2 = {
    title: "Pretty Good",
    rating: 4,
    review: "Crazy flavors, makes this place unique",
    user: yap
}

try {
    yapReview2 = await reviewData.createReview(
        yapReview2.user._id.toString(),
        vivi._id.toString(),
        yapReview2.title,
        yapReview2.rating,
        yapReview2.review,
        'shop'
    )
    console.log("review created");
    console.log(yapReview2);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

let rumyReview2 = {
    title: "Variety",
    rating: 3,
    review: "Mid bubble tea, but the food is good at least",
    user: rumy
}

try {
    rumyReview2 = await reviewData.createReview(
        rumyReview2.user._id.toString(),
        vivi._id.toString(),
        rumyReview2.title,
        rumyReview2.rating,
        rumyReview2.review,
        'shop'
    )
    console.log("review created");
    console.log(rumyReview2);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        tabby._id.toString(),
        amazinReview2._id.toString(),
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
        amazin._id.toString(),
        amazinReview2._id.toString(),
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
    item = await itemData.createItem(
        vivi._id.toString(),
        oolong.title,
        oolong.description,
        oolong.price,
        oolong.tags,
        oolong.allergens,
        424
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        vivi._id.toString(),
        taroMT.title,
        taroMT.description,
        taroMT.price,
        taroMT.tags,
        taroMT.allergens,
        944      
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

// end of vivi
// Gong Cha

let gongCha = {
    name: "Gong Cha",
    address: "527 Washington St, Hoboken, NJ, 07030",
    website: "https://gongchausa.com/",
    phoneNumber: "201-710-5757",
}

try {
    gongCha = await shopData.createShop(
        gongCha.name,
        gongCha.address,
        gongCha.website,
        gongCha.phoneNumber,
        "11",
        "0",
        "AM",
        "9",
        "30",
        "PM",
        customization
    );
    console.log("shop created");
    console.log(gongCha);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let cartiReview1 = {
    title: "carti",
    rating: 3,
    review: "i <3 tHis pLAc3",
    user: carti
}

try{
    cartiReview1 = await reviewData.createReview(
        cartiReview1.user._id.toString(),
        gongCha._id.toString(),
        cartiReview1.title,
        cartiReview1.rating,
        cartiReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(cartiReview1);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let amazinReview3 = {
    title: "Whales...",
    rating: 4,
    review: "Great boba, but sadly no whales",
    user: amazin
}

try{
    amazinReview3 = await reviewData.createReview(
        amazinReview3.user._id.toString(),
        gongCha._id.toString(),
        amazinReview3.title,
        amazinReview3.rating,
        amazinReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(amazinReview3);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let cpReview1 = {
    title: "Cool vibes",
    rating: 2,
    review: "Only go here if you like really sweet boba tea",
    user: CP
}

try{
    cpReview1 = await reviewData.createReview(
        cpReview1.user._id.toString(),
        gongCha._id.toString(),
        cpReview1.title,
        cpReview1.rating,
        cpReview1.review,
        'shop'
    )
    console.log("review created");
    console.log(cpReview1);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let realassReview3 = {
    title: "Mid",
    rating: 3,
    review: "Overrated sadly, not bad though",
    user: realass
}

try{
    realassReview3 = await reviewData.createReview(
        realassReview3.user._id.toString(),
        gongCha._id.toString(),
        realassReview3.title,
        realassReview3.rating,
        realassReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(realassReview3);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    item = await itemData.createItem(
        gongCha._id.toString(),
        oolong.title,
        oolong.description,
        oolong.price,
        oolong.tags,
        oolong.allergens,
        218
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        gongCha._id.toString(),
        taroMT.title,
        taroMT.description,
        taroMT.price,
        taroMT.tags,
        taroMT.allergens,
        103   
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

let bsItem;
try{
    bsItem = await itemData.createItem(
        gongCha._id.toString(),
        bsMT.title,
        bsMT.description,
        bsMT.price,
        bsMT.tags,
        bsMT.allergens,
        195
    );
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

let cpReview2 = {
    title: "First time trying",
    rating: 2,
    review: "Too sweet smh",
    user: CP
}

try{
    cpReview2 = await reviewData.createReview(
        cpReview2.user._id.toString(),
        bsItem._id.toString(),
        cpReview2.title,
        cpReview2.rating,
        cpReview2.review,
        'item'
    )
    console.log("review created");
    console.log(cpReview2);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment(
        tabby._id.toString(),
        cpReview2._id.toString(),
        "I would die if I drank that!"
    )
    console.log("comment created");
    console.log(comment);
}
catch(e){
    console.log("Error creating comment");
    console.log(e);
}

// end of gong cha
// The Whale Tea

let whaleTea = {
    name: "The Whale Tea",
    address: "303 1st St, Hoboken, NJ, 07030",
    website: "https://www.whaleteausa.com/",
    phoneNumber: "201-253-0168",
}

try {
    whaleTea = await shopData.createShop(
        whaleTea.name,
        whaleTea.address,
        whaleTea.website,
        whaleTea.phoneNumber,
        "12",
        "0",
        "PM",
        "9",
        "30",
        "PM",
        customization
    );
    console.log("shop created");
    console.log(whaleTea);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let denksReview2 = {
    title: "it's okay...",
    rating: 3,
    review: "Nothing special really, mid tea, ok service",
    user: denks
}

try{
    denksReview2 = await reviewData.createReview(
        denksReview2.user._id.toString(),
        whaleTea._id.toString(),
        denksReview2.title,
        denksReview2.rating,
        denksReview2.review,
        'shop'
    )
    console.log("review created");
    console.log(denksReview2);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let tabbyReview3 = {
    title: "Hidden gem",
    rating: 5,
    review: "I never heard of this place until the other day but it's great",
    user: tabby
}

try{
    tabbyReview3 = await reviewData.createReview(
        tabbyReview3.user._id.toString(),
        whaleTea._id.toString(),
        tabbyReview3.title,
        tabbyReview3.rating,
        tabbyReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(tabbyReview3);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let rumyReview3 = {
    title: "POISON",
    rating: 1,
    review: "Pretty sure their boba gave me food poisoning :(",
    user: rumy
}

try{
    rumyReview3 = await reviewData.createReview(
        rumyReview3.user._id.toString(),
        whaleTea._id.toString(),
        rumyReview3.title,
        rumyReview3.rating,
        rumyReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(rumyReview3);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

let yapReview3 = {
    title: "Yikes",
    rating: 2,
    review: "Wanted a new place, THIS AINT IT",
    user: yap
}

try{
    yapReview3 = await reviewData.createReview(
        yapReview3.user._id.toString(),
        whaleTea._id.toString(),
        yapReview3.title,
        yapReview3.rating,
        yapReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(yapReview3);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    item = await itemData.createItem(
        whaleTea._id.toString(),
        oolong.title,
        oolong.description,
        oolong.price,
        oolong.tags,
        oolong.allergens,
        940
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        whaleTea._id.toString(),
        taroMT.title,
        taroMT.description,
        taroMT.price,
        taroMT.tags,
        taroMT.allergens,
        653        
    )
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

// end of whale tea


// try{
//     await reviewData.removeReview(review._id.toString())
//     console.log("review removed");
// }catch (e) {
//     console.log("Error removing review");
//     console.log(e);
// }

let flag
try{
    flag = await flagData.createFlag(whaleTea._id.toString(), tabby._id.toString(), "bruh")
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

// try{
//     flag = await flagData.deleteFlag(flag._id.toString())
//     console.log("flag removed");
// }catch (e) {
//     console.log("Error removing flag");
//     console.log(e);
// }
let shopBergen
try {
    shopBergen = await shopData.createShop(
        "Littleboba",
        "374 S Washington Ave, Bergenfield, NJ 07621",
        "https://www.littleboba365.com/",
        "201-778-0001",
        "12",
        "00",
        "PM",
        "1",
        "00",
        "AM",
        customization
    );
    console.log("shop created");
    console.log(shop);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let cartiReview2 = {
    title: "Rockstar Made",
    rating: 4,
    review: "tHis pLac3 sh0uld b3 on 00ppium",
    user: carti
}

try {
    cartiReview2 = await reviewData.createReview(
        cartiReview2.user._id.toString(),
        shopBergen._id.toString(),
        cartiReview2.title,
        cartiReview2.rating,
        cartiReview2.review,
        'shop'
    )
    console.log("review created");
    console.log(cartiReview2);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

let denksReview3 = {
    title: "Pleasantly Surprised",
    rating: 4,
    review: "First boba tea outside Hoboken, its great!",
    user: denks
}

try {
    denksReview3 = await reviewData.createReview(
        denksReview3.user._id.toString(),
        shopBergen._id.toString(),
        denksReview3.title,
        denksReview3.rating,
        denksReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(denksReview3);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

let tiantaoReview3 = {
    title: "Amazing!!",
    rating: 5,
    review: "Fire boba tea",
    user: tiantao
}

try {
    tiantaoReview3 = await reviewData.createReview(
        tiantaoReview3.user._id.toString(),
        shopBergen._id.toString(),
        tiantaoReview3.title,
        tiantaoReview3.rating,
        tiantaoReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(tiantaoReview3);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

let tabbyReview4 = {
    title: "Best in Bergen",
    rating: 5,
    review: "They serve only PEAK here",
    user: tabby
}

try {
    tabbyReview4 = await reviewData.createReview(
        tabbyReview4.user._id.toString(),
        shopBergen._id.toString(),
        tabbyReview4.title,
        tabbyReview4.rating,
        tabbyReview4.review,
        'shop'
    )
    console.log("review created");
    console.log(tabbyReview4);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

// end of shopBergen

// shopFlushing
let shopFlushing
try {
    shopFlushing = await shopData.createShop(
        "Xing Fu Tang",
        "40-52 Main St, Queens, NY 11354",
        "https://xingfutang.com/",
        "929-519-6206",
        "11",
        "00",
        "AM",
        "10",
        "00",
        "PM",
        customization
    );
    console.log("shop created");
    console.log(shop);
} catch (e) {
    console.log("Error creating shop");
    console.log(e);
}

let cpReview3 = {
    title: "Illegal????",
    rating: 3,
    review: "Really good, but the place was NASTY inside",
    user: CP
}

try {
    cpReview3 = await reviewData.createReview(
        cpReview3.user._id.toString(),
        shopFlushing._id.toString(),
        cpReview3.title,
        cpReview3.rating,
        cpReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(cpReview3);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

let cartiReview3 = {
    title: "FW3H",
    rating: 5,
    review: "My brudda k3n cars0n (fschyeah) said dis plac3 fir3",
    user: carti
}

try {
    cartiReview3 = await reviewData.createReview(
        cartiReview3.user._id.toString(),
        shopFlushing._id.toString(),
        cartiReview3.title,
        cartiReview3.rating,
        cartiReview3.review,
        'shop'
    )
    console.log("review created");
    console.log(cartiReview3);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

let realassReview4 = {
    title: "Kings of Flushing!!!",
    rating: 5,
    review: "Best place in Flushing NO CAP",
    user: realass
}

try {
    realassReview4 = await reviewData.createReview(
        realassReview4.user._id.toString(),
        shopFlushing._id.toString(),
        realassReview4.title,
        realassReview4.rating,
        realassReview4.review,
        'shop'
    )
    console.log("review created");
    console.log(realassReview4);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

let yapReview4 = {
    title: "Really good!",
    rating: 4,
    review: "I've been going here since childhood",
    user: yap
}

try {
    yapReview4 = await reviewData.createReview(
        yapReview4.user._id.toString(),
        shopFlushing._id.toString(),
        yapReview4.title,
        yapReview4.rating,
        yapReview4.review,
        'shop'
    )
    console.log("review created");
    console.log(yapReview4);
} catch(e){
    console.log("Error creating review");
    console.log(e);
}

// end of shopFlushing

let admin
try {
    admin = await userData.createUser(
        "phill",
        "Password1!",
        "phill@stevens.edu",
        "Hoboken, NJ",
        "Admin",
        'dark'
    );
    console.log("user created");
    console.log(admin);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}

let bot
let alim
try {
    alim = await userData.createUser(
        "notalim",
        "Password1!",
        "akassymo@stevens.edu",
        "Hoboken, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(alim);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}

// alim review spam

let alimReview1 = {
    title: "So soy",
    rating: 1,
    review: "No MoT10N!!",
    user: alim
}

let alimReview2 = {
    title: "Dairy !!",
    rating: 1,
    review: "Opium Банда",
    user: alim
}

let spamReview
try{
    spamReview = await reviewData.createReview(
        alimReview1.user._id.toString(),
        shop._id.toString(),
        alimReview1.title,
        alimReview1.rating,
        alimReview1.review,
        'shop'
    )
    console.log("Spam review created");
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}


try{
    spamReview = await reviewData.createReview(
        alimReview2.user._id.toString(),
        kft._id.toString(),
        alimReview2.title,
        alimReview2.rating,
        alimReview2.review,
        'shop'
    )
    console.log("Spam review created");
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    spamReview = await reviewData.createReview(
        alimReview2.user._id.toString(),
        vivi._id.toString(),
        alimReview2.title,
        alimReview2.rating,
        alimReview2.review,
        'shop'
    )
    console.log("Spam review created");
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    spamReview = await reviewData.createReview(
        alimReview1.user._id.toString(),
        gongCha._id.toString(),
        alimReview1.title,
        alimReview1.rating,
        alimReview1.review,
        'shop'
    )
    console.log("Spam review created");
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    spamReview = await reviewData.createReview(
        alim._id.toString(),
        whaleTea._id.toString(),
        "WHALES??",
        1,
        "THERE WERE NO WHALES THERE (FWEH)",
        'shop'
    )
    console.log("Spam review created");
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    spamReview = await reviewData.createReview(
        alimReview2.user._id.toString(),
        shopBergen._id.toString(),
        alimReview2.title,
        alimReview2.rating,
        alimReview2.review,
        'shop'
    )
    console.log("Spam review created");
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

try{
    spamReview = await reviewData.createReview(
        alimReview1.user._id.toString(),
        shopFlushing._id.toString(),
        alimReview1.title,
        alimReview1.rating,
        alimReview1.review,
        'shop'
    )
    console.log("Spam review created");
}
catch(e){
    console.log("Error creating review");
    console.log(e);
}

// end of alim review spam

// alim flag spam

try{
    flag = await flagData.createFlag(shop._id.toString(), alim._id.toString(), "Chicken Factory? BANNED")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(kft._id.toString(), alim._id.toString(), "Not Opium")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(vivi._id.toString(), alim._id.toString(), "GO2DAMOON")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(gongCha._id.toString(), alim._id.toString(), "Ken Carson")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(whaleTea._id.toString(), alim._id.toString(), "LISTEN TO 2105!!!")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(shopBergen._id.toString(), alim._id.toString(), "Jennifer's Body (99% Accurate)")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), alim._id.toString(), "I hate flushing")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

// end of alim flag spam


try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), rumy._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), yap._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), tiantao._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), realass._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), tabby._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), denks._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), carti._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), amazin._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), CP._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopBergen._id.toString(), 
        "Strawberry Popping Boba Sundae", 
        "Strawberry Popping Boba Sundae made with your choice of icecream", 
        8.50, 
        ["strawberry", "iced", "dairy"], 
        ["gluten"],
        775
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopBergen._id.toString(), 
        "Sesame Milk Tea", 
        "Sesame Milk Tea (NEW. Soooo Good!!)", 
        5.75, 
        ["taro", "matcha", "honeydew", "mango", "lychee", "strawberry", "jelly", "milk foam", "tapioca pearls", "iced", "milk tea"],
        ["dairy", "sesame"],
        961
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopBergen._id.toString(), 
        "Mango Slush", 
        "Mango Slush all new", 
        5.75, 
        ["taro", "matcha", "honeydew", "mango", "lychee", "strawberry", "jelly", "milk foam", "tapioca pearls", "iced", "slush"],
        [],
        486
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopBergen._id.toString(), 
        "Green Apple Yugurt Tea", 
        "Green Apple Yugurt Tea not YOGURT", 
        5.75, 
        ["taro", "matcha", "honeydew", "mango", "lychee", "strawberry", "jelly", "milk foam", "tapioca pearls", "iced", "fruit tea", "vegan"],
        [],
        252
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopBergen._id.toString(), 
        "Cafe Mocha", 
        "Cafe Mocha Milk Tea", 
        5.75, 
        ["taro", "matcha", "honeydew", "mango", "lychee", "strawberry", "jelly", "milk foam", "tapioca pearls", "iced", "milk tea", "coffee"],
        ["dairy"],
        326
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(   
        shopFlushing._id.toString(), 
        "Lime Green Tea 一顆檸檬鮮綠茶", 
        "Lime Green Tea 一顆檸檬鮮綠茶 all new!", 
        6.43, 
        ["taro", "strawberry", "jelly", "iced", "fruit tea"],
        [],
        518
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(   
        shopFlushing._id.toString(), 
        "Mango Passionfruit Yakult", 
        "Mango Passionfruit Yakult", 
        6.66, 
        ["mango", "iced", "vegan"],
        [],
        730
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopFlushing._id.toString(), 
        "Dalgona Coffee", 
        "Dalgona Coffee 幸福400次鲜奶咖啡", 
        6.20, 
        ["iced", "coffee"],
        ["dairy"],
        658
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopFlushing._id.toString(), 
        "Brown sugar Iced Jelly", 
        "Brown sugar Iced Jelly", 
        5.75, 
        ["iced"],
        ["dairy"],
        153
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shopFlushing._id.toString(), 
        "Kirin King Roasted Oolong Tea", 
        "Kirin King Roasted Oolong Tea 鑽石台灣麒麟茶王", 
        5.75, 
        ["iced", "vegan"],
        [],
        254
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        whaleTea._id.toString(), 
        "Matcha Fresh Milk Tea", 
        "Matcha Fresh Milk Tea now with extra matcha", 
        5.75, 
        ["matcha", "iced", "milk tea"],
        ["dairy"],
        943
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        whaleTea._id.toString(), 
        "Rose Milk Tea", 
        "Rose Milk Tea with real roses", 
        5.25, 
        ["strawberry", "iced", "milk tea", "fruit tea"],
        ["dairy"]
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        whaleTea._id.toString(), 
        "The Whale Crystal", 
        "The Whale Crystal where do they come from?", 
        6.00, 
        ["taro", "mango", "iced", "milk tea"],
        ["dairy"],
        1000
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        gongCha._id.toString(), 
        "PEARL MILK TEA", 
        "PEARL MILK TEA with your choice of flavoring", 
        5.75, 
        ["tapioca pearls", "iced", "milk tea"],
        ["dairy"],
        539
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        gongCha._id.toString(), 
        "EARL GREY MILK TEA WITH 3J’S", 
        "EARL GREY MILK TEA WITH 3J’S (WITH PEARLS, PUDDING & HERBAL JELLY)", 
        5.00, 
        ["jelly", "tapioca pearls", "iced", "milk tea"],
        ["dairy"],
        665
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        vivi._id.toString(), 
        "Flaming Brown Sugar Tapioca Milk", 
        "Flaming Brown Sugar Tapioca Milk With Creme Brulee. Made With Premium Lactaid Milk. Sweetened With Brown Sugar Only. If You Request For No Sugar, Then Its No Brown Sugar, Milk And Creme Brulee Only", 
        6.50, 
        ["tapioca pearls", "iced", "milk tea"],
        ["dairy"],
        136
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        vivi._id.toString(), 
        "Oat Milk Roast Oolong Tea 乌龙鲜燕麦奶茶", 
        "Oat Milk Roast Oolong Tea 乌龙鲜燕麦奶茶 NON DAIRY", 
        6.00, 
        ["tapioca pearls", "iced", "milk tea"],
        [],
        899
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        vivi._id.toString(), 
        "Taro Slush", 
        "Taro Slush extra slushy", 
        6.50, 
        ["taro", "iced", "slush", "vegan"],
        [],
        249
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        kft._id.toString(), 
        "MATCHA MILK CAP", 
        "MATCHA MILK CAP no CAP(lies)", 
        6.89, 
        ["matcha", "iced", "milk foam", "milk tea"],
        ["dairy"],
        354
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        kft._id.toString(), 
        "MANGO GREEN TEA", 
        "MANGO GREEN TEA now VEGAN", 
        6.00, 
        ["mango", "iced", "fruit tea", "vegan"],
        [],
        0
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        kft._id.toString(), 
        "CAPPUCCINO", 
        "CAPPUCCINO with cinnamon", 
        6.00, 
        ["tapioca peals", "milk foam", "iced", "hot", "coffee"],
        ["dairy"],
        803
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shop._id.toString(), 
        "Aaren Patel Special", 
        "Please give to Aaren Patel", 
        6.23, 
        ["lychee", "tapioca peals", "milk foam", "iced", "hot", "milk tea"],
        ["gluten",  "dairy",  "peanuts",  "tree nuts",  "sesame",  "mustard",  "soy",  "eggs",  "fish",  "shellfish"],
        167
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shop._id.toString(), 
        "Mason Lim Special", 
        "Please give to Mason Lim", 
        7.00, 
        ["taro", "tapioca peals", "milk foam", "iced", "hot", "milk tea"],
        ["gluten", "dairy", "shellfish"],
        195
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    item = await itemData.createItem(
        shop._id.toString(), 
        "The Hoohn's Insanity", 
        "i never claimed to be sane i simply claimed to be the sanest person around, which is true seeing i live in a world of crazies - alex ha on his allegations of insanity", 
        5.75, 
        ["match", "tapioca peals", "milk foam", "iced", "hot", "slush"],
        ["dairy"],
        651
    )
    console.log("item created");
    console.log(item)
}catch (e) {
    console.log("Error making item");
    console.log(e);
}

try{
    await userData.updatePoints(
        realass._id.toString(), 
        170
    )
    await userData.updatePoints(
        yap._id.toString(), 
        170
    )
    await userData.updatePoints(
        tiantao._id.toString(), 
        170
    )
    await userData.updatePoints(
        rumy._id.toString(), 
        170
    )
    await userData.updatePoints(
        tabby._id.toString(), 
        350
    )
    await userData.updatePoints(
        denks._id.toString(), 
        185
    )
    await userData.updatePoints(
        carti._id.toString(), 
        15
    )
    await userData.updatePoints(
        amazin._id.toString(), 
        180
    )
    await userData.updatePoints(
        CP._id.toString(), 
        160
    )
    await userData.updatePoints(
        alim._id.toString(), 
        150
    )
    console.log("points updates");
}catch (e) {
    console.log("Error updating points");
    console.log(e);
}
await closeConnection();