import { users, shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";

const getAllUsers = async () => {
    const userCollection = await users();
    const allUsers = await userCollection.find().toArray();
    if(allUsers.length === 0){
        throw "Shops Collection is Empty";
    }
    return allUsers;
}
const getUser = async (id) => {
    id = valid.idCheck(id)
    const userCollection = await users();
    const findUser = await userCollection.findOne({_id: new ObjectId(id)})
    if (findUser === null) throw 'No user with that id'
    //findUser._id = findUser._id.toString();
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
    valid.numCheck(zipcode)
    valid.intCheck(zipcode)//look into verifying real zipcodes
    accountType = valid.stringValidate(accountType)
    const newUser = {
        name: name,
        password: password,
        email: email,
        bio: "",
        zipcode: zipcode,
        accountType: accountType,
        reviews: [],
        comments: []
    }
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add product';
    const newId = insertInfo.insertedId.toString();
    const user = await this.getUser(newId);
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
        updateObject.email = valid.emailCheck(updateObject.email)
        const duplicateEmail = await userCollection.findOne({ email: email });
        if (duplicateEmail) {
            throw `an account with ${email} already exists`;
        }
        user.email = updateObject.email
    }
    if('bio' in updateObject){
        updateObject.bio = valid.stringValidate(updateObject.bio)
        user.bio = updateObject.bio
    }
    if('zipcode' in updateObject){
        updateObject.bio = valid.stringValidate(updateObject.bio)
        user.bio = updateObject.bio
    }
    if('accountType' in updateObject){
        updateObject.accountType = valid.stringValidate(updateObject.accountType)
        user.accountType = updateObject.accountType
    }
    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userId)},
      {$set: user},
      {returnDocument: 'after'}
    )
    if (!updatedInfo) {
      throw 'could not update product successfully';
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

const exportedMethods = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    removeUser
}
export default exportedMethods;