import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import isNullOrUndef from "../isNullOrUndef.js";
import isObject from "../isObject.js";
import createComponentInstance from "../vnode/component/createComponentInstance.js";
import renderLifecycle from "../vnode/component/lifecycles/renderLifecycle.js";
import createDomElement from "./createDomElement.js";

/**
 * render function convert virtual dom to real dom
 * @param { Object } virtualNode - virtual dom representation of real dom
 * @param { Element } container - it is only for ref: { container } use
 */

export default function render(virtualNode) {
    
    /**
     * if virtual dom is undefined return no dom object
     */    

    if(isNullOrUndef(virtualNode)) return;

    /**
     * return mapped array of dom object created from virtual elements
     */

    if(isArray(virtualNode)) {

        return virtualNode.map(singleVirtualNode => render(singleVirtualNode));

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

        virtualNode = createComponentInstance(virtualNode);
        //component

        const rendered = render(virtualNode.ref.virtual);

        virtualNode.ref = {
            realDOM: rendered.ref.realDOM, //assign final realDOM
            virtual: rendered.virtual //assign created instance of virtual inside Element of component
        };

        
        /**
         * means if virtual is not element but component, it become Class.Component from {type, props, _key}
         * we must overwrite the virtal beacause of this
         */

        renderLifecycle(virtualNode);

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

    const newRealNode = createDomElement(virtualNode);

    if(virtualNode._ref) {

        virtualNode._ref(newRealNode);

    }
    
    //virtualNode
    return {
        ref: {
            realDOM: newRealNode
        },
        virtual: virtualNode
    };

}