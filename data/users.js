import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import validator from 'validator';
import bcryptjs from 'bcryptjs';

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

const createUser = async (name, password, email, zipcode, accountType) => {
    name = valid.stringValidate(name)
    email = valid.emailCheck(email)
    const userCollection = await users();
    const duplicateEmail = await userCollection.findOne({ email: email });
    if (duplicateEmail) {
        throw `an account with ${email} already exists`;
    }
    password = valid.passwordCheck(password)
    const hashedPassword = await bcryptjs.hash(password, 12);
    zipcode = valid.stringValidate(zipcode)
    valid.zipcodeCheck(zipcode)
    accountType = valid.stringValidate(accountType)
    if (accountType !== "Admin" && accountType !== "Business" && accountType !== "Default") {
        throw 'invalid account type'
    }
    const newUser = {
        name: name,
        password: hashedPassword,
        email: email,
        bio: "",
        zipcode: zipcode,
        accountType: accountType,
        reviews: [],
        comments: [],
        shopList: [],
        bookmarks: []
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
    user.bookmarks.push(new ObjectId(shopId))
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
    const index = user.bookmarks.indexOf(new ObjectId(shopId));
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
    if('name' in updateObject){
        updateObject.name = valid.stringValidate(updateObject.name)
        user.bio = updateObject.bio
    }
    if('password' in updateObject){
        updateObject.oldPassword = valid.passwordCheck(updateObject.oldPassword)
        updateObject.password = valid.passwordCheck(updateObject.password)
        const isRightPassword = await valid.verifyPassword(updateObject.oldPassword, user.password)
        if(!isRightPassword){
            throw "passwords don't match"
        }
        const hashedPassword = await bcryptjs.hash(updateObject.password, 12);
        user.password = hashedPassword
    }
    if('email' in updateObject){
        if(updateObject.email !== user.email){
            updateObject.email = valid.emailCheck(updateObject.email)
            const duplicateEmail = await userCollection.findOne({ email: email });
            if (duplicateEmail) {
                throw `an account with ${email} already exists`;
            }
            user.email = updateObject.email
        }
    }
    if('bio' in updateObject){
        if(user.bio !== updateObject.bio){
            updateObject.bio = valid.stringValidate(updateObject.bio)
            user.bio = updateObject.bio
        }
    }
    if('zipcode' in updateObject){
        updateObject.zipcode = valid.stringValidate(updateObject.zipcode)
        valid.zipcodeCheck(updateObject.zipcode)
        user.zipcode = updateObject.zipcode
    }
    if('accountType' in updateObject){
        updateObject.accountType = valid.stringValidate(updateObject.accountType)
        user.accountType = updateObject.accountType
    }
    if('comments' in updateObject){
        user.comments = updateObject.comments
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

const removeUser = async (userId) => {
    userId = valid.idCheck(userId)
    const user = await this.getUser(userId)
    const userCollection = await users();
    user.reviews.forEach(function(review) {
        reviewData.removeReview(review);
    });
    user.comments.forEach(function(comment) {
        commentData.removeComment(comment);
    });
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
        user = await userCollection.findOne({ email: emailOrUsername });
        if (!user) {
            throw `Incorrect email or password`;
        }
    } else {
        user = await userCollection.findOne({ name: emailOrUsername });
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


const exportedMethods = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    removeUser,
    loginUser,
    likeShop,
    unlikeShop
}
export default exportedMethods;