

import isArray from "../isArray.js";
import isComponent from "../isComponent.js";
import mountLifecycle from "../vnode/component/lifecycles/mountLifecycle.js";
import willMountLifecycle from "../vnode/component/lifecycles/willMountLifecycle.js";
import filterVirtualElements from "../vnode/filterVirtualElements.js";
import render from "./render.js";

/**
 * used to mount element to webpage
 * @param { Object } instance 
 * @param { Element } container 
 * @param { String } method 
 * @param  {...any} args 
 */

export default function mount(virtual, element, container, method, ...args) {

    if(virtual === null) return;

    if(isArray(virtual)) {

        return element.map((singleElement, i) => mount(virtual[i], singleElement, container, method, ...args));

    }

    const isComponentCache = isComponent(virtual.type);
    
    if(element.ref.realDOM !== null) { //if rendered return no undef value

        if(isComponentCache) {

            willMountLifecycle(virtual);

        }

        container[method](element.ref.realDOM, ...args);

        if(isComponentCache) {

            mountLifecycle(virtual);

        }

    }

    return element;

}