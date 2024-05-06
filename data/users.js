import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { commentData, reviewData, shopData } from "./index.js";

const getAllUsers = async () => {
    const userCollection = await users();
    const allUsers = await userCollection.find().toArray();
    if(allUsers.length === 0){
        throw "Users Collection is Empty";
    }
    return allUsers;
}
const getUser = async (id) => {
    id = valid.idCheck(id)
    const userCollection = await users();
    const findUser = await userCollection.findOne({_id: new ObjectId(id)})
    if (findUser === null) throw 'No user with that id'
    return findUser
}

const createUser = async (name, password, email, address, accountType, themeType) => {
    name = valid.stringValidate(name)
    email = valid.emailCheck(email)
    const userCollection = await users();
    const duplicateName = await userCollection.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (duplicateName) {
        throw `an account with ${name} already exists`;
    }
    const duplicateEmail = await userCollection.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (duplicateEmail) {
        throw `an account with ${email} already exists`;
    }
    password = valid.passwordCheck(password)
    const hashedPassword = await bcryptjs.hash(password, 12);
    address = valid.stringValidate(address)
    accountType = valid.stringValidate(accountType)
    if (accountType !== "Admin" && accountType !== "Business" && accountType !== "Default") {
        throw 'invalid account type'
    }
    themeType = valid.stringValidate(themeType)
    if (themeType !== "dark" && themeType !== "light") {
        throw 'invalid theme type'
    }
    const newUser = {
        name: name,
        password: hashedPassword,
        email: email,
        bio: "",
        address: address,
        accountType: accountType,
        themeType: themeType,
        pfp: "Default_pfp.png",
        reviews: [],
        comments: [],
        shopList: [],
        bookmarks: [],
        numOfPoints: 0
    }
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add product';
    const newId = insertInfo.insertedId.toString();
    const user = await getUser(newId);
    return user;
}

const likeShop = async (userId, shopId) => {
    userId = valid.idCheck(userId)
    shopId = valid.idCheck(shopId)
    const user = await getUser(userId)
    const shop = await shopData.getShop(shopId)
    user.bookmarks.push(shopId)
    shop.numOfLikes += 1
    const userCollection = await users();
    const updatedUser = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(user._id)},
        {$set: user},
        {returnDocument: 'after'}
    );
    if (!updatedUser) {
      throw 'could not update product successfully';
    }
    const shopCollection = await shops();
    const updatedShop = await shopCollection.findOneAndUpdate(
        {_id: new ObjectId(shop._id)},
        {$set: shop},
        {returnDocument: 'after'}
    );
    if (!updatedShop) {
      throw 'could not update product successfully';
    }
    return updatedUser
}

const unlikeShop = async (userId, shopId) => {
    userId = valid.idCheck(userId)
    shopId = valid.idCheck(shopId)
    const user = await getUser(userId)
    const shop = await shopData.getShop(shopId)
    const index = user.bookmarks.indexOf(shopId);
    if (index !== -1) {
        user.bookmarks.splice(index, 1);
    }
    shop.numOfLikes -= 1
    const userCollection = await users();
    const updatedUser = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(user._id)},
        {$set: user},
        {returnDocument: 'after'}
    );
    if (!updatedUser) {
      throw 'could not update product successfully';
    }
    const shopCollection = await shops();
    const updatedShop = await shopCollection.findOneAndUpdate(
        {_id: new ObjectId(shop._id)},
        {$set: shop},
        {returnDocument: 'after'}
    );
    if (!updatedShop) {
      throw 'could not update product successfully';
    }
    return updatedUser
}

const updateUser = async (userId, updateObject) => {
    const user = await getUser(userId)
    const userCollection = await users()
    if(updateObject.name){
        updateObject.name = valid.stringValidate(updateObject.name)
        const duplicateName = await userCollection.findOne({ name: { $regex: new RegExp(`^${updateObject.name}$`, 'i') } });
        if (duplicateName) {
            throw `an account with ${updateObject.name} already exists`;
        }
        user.name = updateObject.name
    }
    if(updateObject.oldPassword){
        updateObject.oldPassword = valid.passwordCheck(updateObject.oldPassword)
        const isRightPassword = await valid.verifyPassword(updateObject.oldPassword, user.password)
        if(!isRightPassword){
            throw "passwords don't match"
        }
    }
    if(updateObject.password){
        updateObject.password = valid.passwordCheck(updateObject.password)
        const hashedPassword = await bcryptjs.hash(updateObject.password, 12);
        user.password = hashedPassword
    }
    if(updateObject.email){
        if(updateObject.email !== user.email){
            updateObject.email = valid.emailCheck(updateObject.email)
            const duplicateEmail = await userCollection.findOne({ email: { $regex: new RegExp(`^${updateObject.email}$`, 'i') } });
            if (duplicateEmail) {
                throw `an account with ${email} already exists`;
            }
            user.email = updateObject.email
        }
    }
    if(updateObject.bio){
        if(user.bio !== updateObject.bio){
            updateObject.bio = valid.stringValidate(updateObject.bio)
            user.bio = updateObject.bio
        }
    }
    if(updateObject.address){
        updateObject.address = valid.stringValidate(updateObject.address)
        user.address = updateObject.address
    }
    if(updateObject.accountType){
        updateObject.accountType = valid.stringValidate(updateObject.accountType)
        user.accountType = updateObject.accountType
    }
    if(updateObject.themeType){
        updateObject.themeType = valid.stringValidate(updateObject.themeType)
        user.themeType = updateObject.themeType
    }
    if(updateObject.pfp){
        updateObject.pfp = valid.stringValidate(updateObject.pfp)
        user.pfp = updateObject.pfp
    }
    if(updateObject.comments){
        user.comments = updateObject.comments
    }
    if(updateObject.numOfPoints){
        user.numOfPoints = updateObject.numOfPoints
    }
    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {$set: user},
      {returnDocument: 'after'}
    )
    if (!updatedInfo) {
      throw 'could not update user successfully';
    }
    return updatedInfo
}

const removeUser = async (userId, password) => {
    userId = valid.idCheck(userId)
    //password = valid.passwordCheck(password)
    const user = await getUser(userId)
    /*const isRightPassword = await valid.verifyPassword(password, user.password)
    if(!isRightPassword){
        throw "incorrect password"
    }*/
    const deletedReviews = user.reviews.map(async (review) => await reviewData.removeReview(review._id.toString()));
    const deleted = await Promise.all(deletedReviews);
    const deletedComments = user.comments.map(async (comment) => await commentData.removeComment(comment.toString()));
    const deleted2 = await Promise.all(deletedComments);
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
        _id: new ObjectId(userId)
    });
    if(!deletionInfo){
      throw 'could not delete'
    }
    return deletionInfo
}

const loginUser = async (emailOrUsername, password) => {
    const userCollection = await users();
    emailOrUsername = valid.stringValidate(emailOrUsername)
    password = valid.stringValidate(password)
    let user
    if(validator.isEmail(emailOrUsername)) {
        user = await userCollection.findOne({ email: { $regex: new RegExp(`^${emailOrUsername}$`, 'i') } });
        if (!user) {
            throw `Incorrect email or password`;
        }
    } else {
        user = await userCollection.findOne({ name: { $regex: new RegExp(`^${emailOrUsername}$`, 'i') } });
        if (!user) {
            throw `Incorrect email or password`;
        }
    }
    const isRightPassword = await valid.verifyPassword(password, user.password)
    if (!isRightPassword) {
        throw `Incorrect email or password`;
    }
    return user;
};

const updatePoints = async (userId, num) => {
    userId = valid.idCheck(userId)
    const user = await getUser(userId)
    const numOfPoints = num + user.numOfPoints 
    const update = {numOfPoints: numOfPoints}
    const updated = await updateUser(userId, update)
    return updated
}

const exportedMethods = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    removeUser,
    loginUser,
    likeShop,
    unlikeShop,
    updatePoints
}
export default exportedMethods;