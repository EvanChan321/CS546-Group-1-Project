import { dbConnection, closeConnection } from "../config/mongoConnection.js";

import userData from "../data/users.js";

const db = await dbConnection();
await db.collection("users").drop();

let user = {
    name: "Tabby",
    password: "Password1!",
    email: "mangelak@stevens.edu",
    zipcode: "07630",
    accountType: "Default",
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

await closeConnection();