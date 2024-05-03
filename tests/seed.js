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
    themeType: 'light'
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

// oolong item

let oolong = {
    title: "Oolong Tea",
    description: "The finest tea, perfect for both sweet and non-sweet enjoyers",
    price: 5.99,
    tags: ["honey", "tapioca", "jelly", "iced", "milk", "malted"],
    allergens: ["milk"]
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

let tabbyReview2 = {
    title: "ass",
    rating: 1,
    review: "this is bad",
    user: tabby
}

try{
    tabbyReview2 = await reviewData.createReview(
        tabbyReview2.user._id.toString(),
        shop._id.toString(),
        tabbyReview2.title,
        tabbyReview2.rating,
        tabbyReview2.review,
        'shop'
    )
    console.log("review incorrectly created");
    console.log(tabbyReview2);
}
catch(e){
    console.log("Correctly errored review");
    console.log(e);
}

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
        ["gluten"]
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
        taroMT.allergens        
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
        oolong.allergens
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
        taroMT.allergens        
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
        []
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
        oolong.allergens
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
        taroMT.allergens        
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

try{
    item = await itemData.createItem(
        gongCha._id.toString(),
        oolong.title,
        oolong.description,
        oolong.price,
        oolong.tags,
        oolong.allergens
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
        taroMT.allergens        
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
        bsMT.allergens
    );
    console.log("item created");
} catch(e){
    console.log("Error making item");
    console.log(e);
}

let cpReview1 = {
    title: "First time trying",
    rating: 2,
    review: "Too sweet smh",
    user: CP
}

try{
    cpReview1 = await reviewData.createReview(
        cpReview1.user._id.toString(),
        bsItem._id.toString(),
        cpReview1.title,
        cpReview1.rating,
        cpReview1.review,
        'item'
    )
    console.log("review created");
    console.log(cpReview1);
} catch (e) {
    console.log("Error creating review");
    console.log(e);
}

try{
    comment = await commentData.createComment( // THIS SHIT DONT WORK
        tabby._id.toString(),
        cpReview1._id.toString(),
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

try{
    item = await itemData.createItem(
        whaleTea._id.toString(),
        oolong.title,
        oolong.description,
        oolong.price,
        oolong.tags,
        oolong.allergens
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
        taroMT.allergens        
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

await closeConnection();