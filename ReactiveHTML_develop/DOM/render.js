import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import isObject from "../isObject.js";
import renderLifecycle from "../vnode/component/lifecycles/renderLifecycle.js";
import willRenderLifecycle from "../vnode/component/lifecycles/willRenderLifecycle.js";
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

    if(virtualNode === null) {

        return {
            ref: {
                realDOM: null
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
        willRenderLifecycle(virtualNode);

        virtualNode.ref.realDOM = render(virtualNode.ref.virtual, virtualNode).ref.realDOM;

        renderLifecycle(virtualNode);

        virtualNode.ref.container = container;

        return virtualNode;

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