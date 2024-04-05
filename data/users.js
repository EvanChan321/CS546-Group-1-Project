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

const exportedMethods = {
    getAllUsers,
    getUser,
    createUser
}
export default exportedMethods;