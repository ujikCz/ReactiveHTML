

import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import isNullOrUndef from "../isNullOrUndef.js";
import mountLifecycle from "../vnode/component/lifecycles/mountLifecycle.js";
import willMountLifecycle from "../vnode/component/lifecycles/willMountLifecycle.js";

/**
 * used to mount element to webpage
 * @param { Object } instance 
 * @param { Element } container 
 * @param { String } method 
 * @param  {...any} args 
 */

export default function mount(newNodeDefinition, container, method, ...args) {

    if(isArray(newNodeDefinition)) {

        return newNodeDefinition.map(singleNewNodeDefinition => mount(singleNewNodeDefinition, container, method, ...args));

    }

    const isComponentCache = isComponent(newNodeDefinition.virtualNode.type);

    if(newNodeDefinition.realDOM !== undefined) { //if rendered return no null value

        if(isComponentCache) {

            willMountLifecycle(newNodeDefinition.virtualNode, container);

        }

        container[method](newNodeDefinition.realDOM, ...args);
            
        if(isComponentCache) {
            
            mountLifecycle(newNodeDefinition.virtualNode, container);

        }

    }

    return newNodeDefinition.realDOM;

}