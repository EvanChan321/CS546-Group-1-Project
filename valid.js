import { ObjectId } from "mongodb";
import validator from 'validator';
import { phone } from "phone";

export function numCheck (num) {
    if (typeof(num) !== 'number'){
        throw (`${num} is not a number`);
    }
    if(isNaN(num)){
        throw (`${num} is not a number`);
    }
};
export function intCheck (num) {
    if(!Number.isInteger(num)){
        throw (`${num} is not an integer`);
    }
};
export function objectCheck (val) {
    if (typeof(val) !== 'object'){
        throw (`${val} is not a object`);
    }
};
export function arrayCheck (val) {
    if(!Array.isArray(val)){
        throw (`${val} is not an array`);
    }
};
export function atLeast (val, checkVal) {
    if(val.length < checkVal){
        throw (`${val} has less than 2 elements`);
    }
};
export function functionCheck (val) {
    if (typeof(val) !== 'function'){
        throw (`${val} is not a function`);
    }
}
export function stringCheck (val) {
    if (typeof(val) !== 'string'){
        throw (`${val} is not a string`);
    }
}
export function keyCheck (val) {
    if (Object.keys(val).length === 0) {
        throw (`${val} is empty`);
    }
}
export function notArrayCheck (val) {
    if(Array.isArray(val)){
        throw (`${val} is an array`);
    }
};

export function stringValidate (val){
    stringCheck(val)
    val = val.trim
    atLeast(val, 1)
    return val
}

export function idCheck (val) {
    stringCheck(val)
    atLeast(val.trim(), 1)
    if (!ObjectId.isValid(val)) {
        throw `Error as ${val} invalid object ID`;
    }
    return val.trim()
}

export function emailCheck (val) {
    if(!validator.isEmail(val.trim())){
        throw "not valid email"
    }
    return val.trim()
}

export function urlCheck (val) {
    if(!validator.isURL(val.trim())){
        throw "not valid url"
    }
    return val.trim()
}

export function phoneNumberCheck (val){
    if (!phone(val.trim()).isValid) {
        throw `not a valid phone number`;
    }
    return val.trim()
}

export function passwordCheck (val){
    val = stringValidate(val)
    if (/\s/.test(val)) {
        throw "password cannot have spaces"
    }
    if(!validator.isStrongPassword(val)){
        throw "is not a strong password"
    }
    return val
}

export function arrayOfStrings (val){
    arrayCheck(val)
    for(let i = 0; i < val.length; i++){
        val[i] = stringValidate(val[i])
    }
    return val
}

export function maxDecimal (val, num) {
    if(!(String(val).split(".")[1]?.length <= num)){
        throw 'Too many decimal places'
    }
}