import isArray from "./isArray.js";
import isObject from "./isObject.js";


export default function isVirtualElement(virtualElement) {

    if(isObject(virtualElement) && !isArray(virtualElement) && !virtualElement.type.ReactiveHTMLComponent) return true;
    return false;

}