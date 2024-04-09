import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import userData from "../data/users.js";
import shopData from "../data/shops.js"

const db = await dbConnection();
await db.collection("users").drop();
await db.collection("shops").drop();

let user = {
    name: "Tabby",
    password: "Password1!",
    email: "mangelak@stevens.edu",
    zipcode: "07630",
    accountType: "Default",
}

let shop = {
    name: "Chicken Factory",
    address: "529 Washington St, Hoboken, NJ, 070",
    website: "google.com",
    phoneNumber: "2018199192",
}

try {
    user = await userData.createUser(
        user.name,
        user.password,
        user.email,
        user.zipcode,
        user.accountType
    );
    console.log("user created");
    console.log(user);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

try {
    shop = await shopData.createShop(
        shop.name,
        shop.address,
        shop.website,
        shop.phoneNumber,
    );
    console.log("shop created");
    console.log(shop);
} catch (e) {
    console.log("Error creating user");
    console.log(e);
}

await closeConnection();