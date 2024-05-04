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
    console.log(bot);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), alim._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try {
    bot = await userData.createUser(
        "redrumy",
        "Password1!",
        "knakano@stevens.edu",
        "Rockaway, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(bot);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), bot._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try {
    bot = await userData.createUser(
        "yap",
        "Password1!",
        "myap@stevens.edu",
        "Hoboken, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(bot);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), bot._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try {
    bot = await userData.createUser(
        "tiantao",
        "Password1!",
        "echeng2@stevens.edu",
        "Edison, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(bot);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), bot._id.toString(), "wrong hours")
    console.log("flag added");
    console.log(flag);
}catch (e) {
    console.log("Error adding flag");
    console.log(e);
}
try {
    bot = await userData.createUser(
        "realass",
        "Password1!",
        "carias1@stevens.edu",
        "Brick, NJ",
        "Default",
        'dark'
    );
    console.log("user created");
    console.log(bot);
}catch (e) {
    console.log("Error creating user");
    console.log(e);
}
try{
    flag = await flagData.createFlag(shopFlushing._id.toString(), bot._id.toString(), "wrong hours")
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
        bot._id.toString(), 
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