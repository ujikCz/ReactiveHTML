import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import isObject from "../isObject.js";
import createDomElement from "./createDomElement.js";

/**
 * render function convert virtual dom to real dom
 * @param { Object } virtualNode - virtual dom representation of real dom
 * @param { Element } container - it is only for ref: { container } use
 */

export default function render(virtualNode, container) {
    
    /**
     * if virtual dom is undefined return no dom object
     */

    if(virtualNode === undefined) {

        return {
            ref: {
                realDOM: undefined
            },
            virtual: virtualNode
        };

    }

    /**
     * return mapped array of dom object created from virtual elements
     */

    if(isArray(virtualNode)) {

        return virtualNode.map(singleVirtualNode => render(singleVirtualNode, container));

    }

    /**
     * create text nodes 
     */

    if(!isObject(virtualNode)) {

        //text node
        return {
            ref: {
                realDOM: document.createTextNode(virtualNode)
            },
            virtual: virtualNode
        };

    }

    /**
     * create components and assign ref specifications
     */

    if(isComponent(virtualNode.type)) {

        //component
        virtualNode.ref.realDOM = render(virtualNode.virtual, virtualNode).ref.realDOM;
        virtualNode.ref.container = container;

        return {
            ref: {
                realDOM: virtualNode.ref.realDOM
            },
            virtual: virtualNode
        };

    }

    /**
     * creates basic elements
     */

    //virtualNode
    return {
        ref: {
            realDOM: createDomElement(virtualNode, container)
        },
        virtual: virtualNode
    };

}