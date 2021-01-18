import isObject from "../isObject.js";
import isVirtualElement from "../isVirtualElement.js";
import createDomElement from "./createDomElement.js";


export default function createDOMfromRenderedVirtualNode(virtualNode) {
    
    if(isVirtualElement(virtualNode)) {

        //element
        return createDomElement(virtualNode);

    }

    if(isObject(virtualNode)) {
        virtualNode.ref.realDOM = createDOMfromRenderedVirtualNode(virtualNode.vnode);

        virtualNode.onComponentRender(virtualNode.ref.realDOM);

        //virtualNode
        return virtualNode.ref.realDOM;

    }

    //text node
    return document.createTextNode(virtualNode);

}