

import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import mountLifecycle from "../vnode/component/lifecycles/mountLifecycle.js";
import willMountLifecycle from "../vnode/component/lifecycles/willMountLifecycle.js";

/**
 * used to mount element to webpage
 * @param { Object } instance 
 * @param { Element } container 
 * @param { String } method 
 * @param  {...any} args 
 */

export default function mount(virtual, container, method, ...args) {

    if(virtual === undefined) return;

    if(isArray(virtual)) {

        return virtual.map(singleVirtual => mount(singleVirtual, container, method, ...args));

    }

    const isComponentCache = isComponent(virtual.virtual.type);
    
    if(virtual.ref.realDOM !== undefined) { //if rendered return no null value

        if(isComponentCache) {

            willMountLifecycle(virtual.virtual, container);

        }

        container[method](virtual.ref.realDOM, ...args);
            
        if(isComponentCache) {
            
            mountLifecycle(virtual.virtual, container);

        }

    }

    return virtual.ref.realDOM;

}