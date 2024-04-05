import { ObjectId } from "mongodb";

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

export function idCheck (val) {
    stringCheck(val)
    atLeast(val.trim(), 1)
    if (!ObjectId.isValid(id)) {
        throw `Error as ${id} invalid object ID`;
    }
    return val.trim()
}