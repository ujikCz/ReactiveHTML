import isArray from "./isArray.js";
import isFunction from "./isFunction.js";
import isObject from "./isObject.js";


export default function isComponent(type) {

    if(isFunction(type) && type.prototype.isReactiveHTMLComponent) return true;
    return false;

}