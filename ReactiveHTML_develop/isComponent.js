import isFunction from "./isFunction.js";


export default function isComponent(type) {

    if(isFunction(type) && type.prototype.isReactiveHTMLComponent) return true;
    return false;

}