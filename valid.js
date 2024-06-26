import { ObjectId } from "mongodb";
import validator from 'validator';
import { phone } from "phone";
import bcryptjs from 'bcryptjs';
import NodeGeocoder from "node-geocoder";
import { shopData } from "./data/index.js";
import badwords from "bad-words";

export function numCheck(num) {
    if (typeof (num) !== 'number') {
        throw (`${num} is not a number`);
    }
    if (isNaN(num)) {
        throw (`${num} is not a number`);
    }
};
export function intCheck(num) {
    if (!Number.isInteger(num)) {
        throw (`${num} is not an integer`);
    }
};
export function objectCheck(val) {
    if (typeof (val) !== 'object') {
        throw (`${val} is not a object`);
    }
};
export function arrayCheck(val) {
    if (!Array.isArray(val)) {
        throw (`${val} is not an array`);
    }
};
export function atLeast(val, checkVal, valName) {
    if (val.length < checkVal) {
        throw (`${valName} has less than 2 elements`);
    }
};
export function functionCheck(val) {
    if (typeof (val) !== 'function') {
        throw (`${val} is not a function`);
    }
}
export function stringCheck(val, valName) {
    if (typeof (val) !== 'string') {
        throw (`${valName} is not a string`);
    }
}
export function keyCheck(val) {
    if (Object.keys(val).length === 0) {
        throw (`${val} is empty`);
    }
}
export function notArrayCheck(val) {
    if (Array.isArray(val)) {
        throw (`${val} is an array`);
    }
};

export function customizationCheck(val) {
    let customization = ["ice_level", "sugar_level", "size_options", "customization_charge"]
    if (!customization.includes(val)) {
        throw 'invalid customization'
    }
};


export function booleanCheck(val) {
    if (typeof val !== "boolean") {
        throw (`${val} is not an array`);
    }
};

export function stringValidate(val, valName) {
    stringCheck(val, valName)
    val = val.trim()
    atLeast(val, 1, valName)
    let filter = new badwords()
    val = filter.clean(val)
    return val
}

export function idCheck(val) {
    stringCheck(val)
    atLeast(val.trim(), 1, 'id')
    if (!ObjectId.isValid(val)) {
        throw `Error as ${val} invalid object ID`;
    }
    return val.trim()
}

export function emailCheck(val) {
    if (!validator.isEmail(val.trim())) {
        throw "not valid email"
    }
    return val.trim()
}

export function urlCheck(val) {
    if (!validator.isURL(val.trim())) {
        throw "not valid url"
    }
    return val.trim()
}

export function phoneNumberCheck(val) {
    if (!phone(val.trim()).isValid) {
        throw `not a valid phone number`;
    }
    return val.trim()
}

let options = {
    minLength: 8,
    minUppercase: 1,
    minNumber: 1,
    minSymbols: 1
};

export function passwordCheck(val) {
    val = stringValidate(val)
    if (/\s/.test(val)) {
        throw "password cannot have spaces"
    }
    if (!validator.isStrongPassword(val, options)) {
        throw "Password must be 8 characters long and contain: 1 Uppercase 1 Number 1 Symbol"
    }
    return val
}

export function checkPrice(price) {
    numCheck(price, 'Price');
    if (price != price.toFixed(2)) throw "Price cannot be more than 2 decimal places";
    if (price < 0) throw "Price cannot be negative";
    return price;
}

export function arrayOfStrings(val) {
    arrayCheck(val)
    for (let i = 0; i < val.length; i++) {
        val[i] = stringValidate(val[i])
    }
    return val
}

export function maxDecimal(val, num) {
    if (!(String(val).split(".")[1]?.length <= num)) {
        throw 'Too many decimal places'
    }
}

export async function verifyPassword(password, hash) {
    const right = await bcryptjs.compare(password, hash);
    return right
}

export function sortLev(stores, search) {
    const searchLower = search.toLowerCase();
    function calculateLevenshtein(store, search, x, y) {
        store = store.toLowerCase();
        if (store.includes(search)) return 0;
        if (x === 0) return y;
        if (y === 0) return x;
        const dp = Array(x + 1).fill(null).map(() => Array(y + 1).fill(null));
        for (let i = 0; i <= x; i++) { dp[i][0] = i }
        for (let j = 0; j <= y; j++) { dp[0][j] = j; }
        for (let i = 1; i <= x; i++) {
            for (let j = 1; j <= y; j++) {
                const substitutionCost = store[i - 1] === search[j - 1] ? 0 : 1;
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],
                    dp[i][j - 1],
                    dp[i - 1][j - 1] + substitutionCost
                );
            }
        }
        return dp[x][y];
    }
    for (let i = 1; i < stores.length; i++) {
        let current = stores[i];
        let currentLev = calculateLevenshtein(current.name, searchLower, current.name.length, searchLower.length);
        let j = i - 1;

        while (j >= 0 && (
            calculateLevenshtein(stores[j].name, searchLower, stores[j].name.length, searchLower.length) > currentLev ||
            (calculateLevenshtein(stores[j].name, searchLower, stores[j].name.length, searchLower.length) === currentLev && stores[j].likes < current.likes)
        )) {
            stores[j + 1] = stores[j];
            j--;
        }
        stores[j + 1] = current;
    }
    return stores;
}

export async function getLatLong(address) {
    address = stringValidate(address);
    let options = { provider: "google", apiKey: "AIzaSyD6pVaBxSAagHYO28XRIu6DgWsPzpuNpNY" };
    let geocoder = NodeGeocoder(options);
    let res = await geocoder.geocode(address);
    let returnObj;
    if (!res || !res[0] || !res[0].latitude || !res[0].longitude) {
        throw `Your ${elmName} could not be found.
        \n Example: 1234 Main St, City`;
    } else {
        returnObj = { lat: res[0].latitude, lng: res[0].longitude };
    }

    return returnObj;
}

export async function getPins() {
    const shops = await shopData.getAllShops();
    let pins = [];

    for (const shop of shops) {
        const cords = await getLatLong(shop.address);
        const shopPage = "/shop/" + shop._id.toString();

        const curr = {
            position: cords,
            title: shop.name,
            url: shopPage,
            color: shop.numOfLikes
        };

        pins.push(curr);
    }

    return pins;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);
    const dlon = lon2Rad - lon1Rad;
    const dlat = lat2Rad - lat1Rad;
    const a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(dlon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

export function convertTime(hour1, minute1, ampm1, hour2, minute2, ampm2) {
    try {
        hour1 = stringValidate(hour1)
        hour1 = parseInt(hour1)
        minute1 = stringValidate(minute1)
        minute1 = parseInt(minute1)
        ampm1 = stringValidate(ampm1)
        hour2 = stringValidate(hour2)
        hour2 = parseInt(hour2)
        minute1 = stringValidate(minute2)
        minute2 = parseInt(minute2)
        ampm2 = stringValidate(ampm2)
        if (hour1 < 1 || hour1 > 12) {
            throw 'hour out of range'
        }
        if (hour2 < 1 || hour2 > 12) {
            throw 'hour out of range'
        }
        if (minute1 < 0 || minute1 > 59) {
            throw 'minute out of range'
        }
        if (minute2 < 0 || minute2 > 59) {
            throw 'minute out of range'
        }
        if (ampm1 !== "PM" && ampm1 !== "AM") {
            throw 'time needs to be in AM or PM'
        }
        if (ampm2 !== "PM" && ampm2 !== "AM") {
            throw 'time needs to be in AM or PM'
        }
        if (ampm1 === "PM" && hour1 !== 12) {
            hour1 += 12;
        } else if (ampm1 === "AM" && hour1 === 12) {
            hour1 = 0;
        }
        if (ampm2 === "PM" && hour2 !== 12) {
            hour2 += 12;
        } else if (ampm2 === "AM" && hour2 === 12) {
            hour2 = 0;
        }
        let openTime = new Date(0, 0, 0, hour1, minute1);
        let closeTime = new Date(0, 0, 0, hour2, minute2);
        return { openTime, closeTime }
    }
    catch (e) {
        throw e
    }
}

export async function getDistances(shops, address) {
    const userAddress = await getLatLong(address);
    for (const shop of shops) {
        const cords = await getLatLong(shop.address);
        let currDistance = haversineDistance(userAddress.lat, userAddress.lng, cords.lat, cords.lng);
        currDistance = currDistance.toFixed(1);
        shop.distance = currDistance
    }
    return shops;
}