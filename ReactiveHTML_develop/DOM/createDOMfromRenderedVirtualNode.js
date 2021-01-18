import isComponent from "../isComponent.js";
import isObject from "../isObject.js";
import createDomElement from "./createDomElement.js";


export default function createDOMfromRenderedVirtualNode(virtualNode) {
    
    if(!isObject(virtualNode)) {

        //text node
        return document.createTextNode(virtualNode);

    }

    if(isComponent(virtualNode.type)) {

        virtualNode.ref.realDOM = createDOMfromRenderedVirtualNode(virtualNode.vnode);

        virtualNode.onComponentRender(virtualNode.ref.realDOM);

        //virtualNode
        return virtualNode.ref.realDOM;

    }

    return createDomElement(virtualNode);

}