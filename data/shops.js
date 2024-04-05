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
    if (findShop === null) throw 'No shop with that id'
    //findUser._id = findUser._id.toString();
    return findShop
}

const createShop = async (ownerId, name, address, website, phoneNumber) => {
    if(ownerId !== null){
        ownerId = valid.idCheck(ownerId)
    }
    name = valid.stringValidate(name)
    address = valid.stringValidate(address)
    website = valid.urlCheck(website)
    phoneNumber = valid.phoneNumberCheck(phoneNumber)
    const newShop = {
        name: name,
        address: address,
        website: website,
        phoneNumber: phoneNumber,
        flags: [],
        items: [],
        reviews: [],
        averageRating: "No Ratings"
    }
    const shopCollection = await shops();
    const insertInfo = await shopCollection.insertOne(newShop);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add product';
    const newId = insertInfo.insertedId.toString();
    const shop = await this.getShop(newId);
    return shop;
}

const exportedMethods = {
    getAllShops,
    getShop,
    createShop
}
export default exportedMethods;