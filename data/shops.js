import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

const shopCollection = await shops();

const getAllShops = async () => {
    const allShops = await shopCollection.find().toArray();
    if(allShops.length === 0){
        throw "Shops Collection is Empty";
    }
    return allShops;
}

const exportedMethods = {
    getAllShops
}
export default exportedMethods;