import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

const userCollection = await shops();

const getAllUsers = async () => {
    const allUsers = await userCollection.find().toArray();
    if(allUsers.length === 0){
        throw "Shops Collection is Empty";
    }
    return allUsers;
}

const exportedMethods = {
    getAllUsers
}
export default exportedMethods;