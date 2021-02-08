import isFunction from "./isFunction.js";


export default function isComponent(type) {

    if(isFunction(type) && type.prototype.isKiqComponent) return true;
    return false;

}