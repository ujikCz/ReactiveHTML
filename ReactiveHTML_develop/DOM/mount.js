

import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import isNullOrUndef from "../isNullOrUndef.js";
import isObject from "../isObject.js";
import mountLifecycle from "../vnode/component/lifecycles/mountLifecycle.js";
import willMountLifecycle from "../vnode/component/lifecycles/willMountLifecycle.js";

/**
 * used to mount element to webpage
 * @param { Object } instance 
 * @param { Element } container 
 * @param { String } method 
 * @param  {...any} args 
 */

export default function mount(newNodedef, container, method, ...args) {

    if(isArray(newNodedef)) {

        for(let i = 0; i < newNodedef.length; i++) {

            mount(newNodedef[i], container, 'appendChild');

        }

        return newNodedef;
    }

    const virtualNode = newNodedef.virtualNode;
    const realDOM = newNodedef.realDOM;

    const isComponentCache = isObject(virtualNode) && isComponent(virtualNode.type);

    if(realDOM !== undefined) { //if rendered return no null value

        if(isComponentCache) {

            willMountLifecycle(virtualNode, container);

        }

        container[method](realDOM, ...args);
            
        if(isComponentCache) {
            
            mountLifecycle(virtualNode, container);

        }

    }

    return newNodedef;

}