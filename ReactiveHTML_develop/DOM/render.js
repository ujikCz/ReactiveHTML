import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import isNullOrUndef from "../isNullOrUndef.js";
import isObject from "../isObject.js";
import createComponentInstance from "../vnode/component/createComponentInstance.js";
import renderLifecycle from "../vnode/component/lifecycles/renderLifecycle.js";
import createDomElement from "./createDomElement.js";
import resolveRef from "./resolveRef.js";

/**
 * render function convert virtual dom to real dom
 * @param { Object } virtualNode - virtual dom representation of real dom
 * @param { Element } container - it is only for ref: { container } use
 */

export default function render(virtualNode) {

    /**
     * if virtual dom is undefined return no dom object
     */
    if (isNullOrUndef(virtualNode)) {

        throw Error(`virtual node cannot be null or undefined`);

    };

    /**
     * return mapped array of dom object created from virtual elements
     */
    

    /**
     * create text nodes 
     */

    if (!isObject(virtualNode)) {

        //text node
        return {
            realDOM: document.createTextNode(virtualNode),
            virtualNode
        };

    }

    if (isArray(virtualNode)) {

        const res = [];

        for(let i = 0; i < virtualNode.length; i++) {

            res.push(render(virtualNode[i]));

        }

        return res;
    
    }

    /**
     * create components and assign ref specifications
     */

    if (isComponent(virtualNode.type)) {

        virtualNode = createComponentInstance(virtualNode);
        //component
        const newNodeDefinition = render(virtualNode._internals.virtualNode);
        virtualNode._internals = newNodeDefinition;


        /**
         * means if virtual is not element but component, it become Class.Component from {type, props, _key}
         * we must overwrite the virtal beacause of this
         */

        renderLifecycle(virtualNode);

        return {
            realDOM: newNodeDefinition.realDOM,
            virtualNode
        };

    }

    /**
     * creates basic elements
     */

    const newRealNode = createDomElement(virtualNode);
    const __ref = virtualNode._ref;
    if (__ref) {

        Object.assign(__ref, resolveRef(__ref, newRealNode));

        if(__ref._onresolve) {

            __ref._onresolve(__ref);

        }

    }

    //virtualNode
    return {
        realDOM: newRealNode,
        virtualNode
    };

}