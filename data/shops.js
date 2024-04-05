import { users } from "../config/mongoCollections.js";
import { shops } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as valid from "../valid.js";


const getAllShops = async () => {
    const shopCollection = await shops();
    const allShops = await shopCollection.find().toArray();
    if(allShops.length === 0){
        throw "Shops Collection is Empty";
    }
    return allShops;
}

const getShop = async (id) => {
    id = valid.idCheck(id)
    const shopCollection = await shops();
    const findShop = await shopCollection.findOne({_id: new ObjectId(id)})
    if (findShop === null) throw 'No user with that id'
    //findUser._id = findUser._id.toString();
    return findShop
}

const exportedMethods = {
    getAllShops,
    getShop
}
export default exportedMethods;