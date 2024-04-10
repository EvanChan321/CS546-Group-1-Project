import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import validator from 'validator';

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
    zipcode = valid.stringValidate(zipcode)
    valid.zipcodeCheck(zipcode)
    accountType = valid.stringValidate(accountType)
    if (accountType !== "Admin" && accountType !== "Business" && accountType !== "Default") {
        throw 'invalid account type'
    }
    const newUser = {
        name: name,
        password: password,
        email: email,
        bio: "",
        zipcode: zipcode,
        accountType: accountType,
        reviews: [],
        comments: [],
        shopList: []
    }
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add product';
    const newId = insertInfo.insertedId.toString();
    const user = await getUser(newId);
    return user;
}

const updateUser = async (userId, updateObject) => {
    const user = await getUser(userId)
    const userCollection = await users()
    if('name' in updateObject){
        updateObject.name = valid.stringValidate(updateObject.name)
        user.bio = updateObject.bio
    }
    if('password' in updateObject){
        updateObject.password = valid.stringValidate(updateObject.password)
        user.password = updateObject.password
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
    emailOrUsername = emailOrUsername.stringValidate(emailOrUsername)
    if(validator.isEmail(emailOrUsername)) {
        const user = await userCollection.findOne({ email: emailOrUsername });
        if (!user) {
            throw `Incorrect email or password`;
        }
        if (!valid.verifyPassword(password, user.password)) {
            throw `Incorrect email or password`;
        }
        return user;
    } else {
        const user = await userCollection.findOne({ username: emailOrUsername });
        if (!user) {
            throw `Incorrect email or password`;
        }
        if (!valid.verifyPassword(password, user.password)) {
            throw `Incorrect email or password`;
        }
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
    loginUser
}
export default exportedMethods;