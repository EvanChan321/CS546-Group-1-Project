import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";
import { idCheck } from "../valid.js";

const getAllUsers = async () => {
    const userCollection = await shops();
    const allUsers = await userCollection.find().toArray();
    if(allUsers.length === 0){
        throw "Shops Collection is Empty";
    }
    return allUsers;
}
const getUser = async (id) => {
    id = valid.idCheck(id)
    const userCollection = await shops();
    const findUser = await userCollection.findOne({_id: new ObjectId(id)})
    if (findUser === null) throw 'No user with that id'
    //findUser._id = findUser._id.toString();
    return findUser
}

const exportedMethods = {
    getAllUsers,
    getUser
}
export default exportedMethods;