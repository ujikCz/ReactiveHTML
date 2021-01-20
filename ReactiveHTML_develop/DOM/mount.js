

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

export default function mount(instance, container, method, ...args) {

    if(instance === null) return;

    if(isArray(instance)) {

        return instance.map(singleInstance => mount(filterVirtualElements(singleInstance), container, method, ...args));

    }

    const rendered = render(instance, container);
    const isComponentCache = isComponent(instance.type);
    
    if(rendered.ref.realDOM !== null) { //if rendered return no undef value

        if(isComponentCache) {

            willMountLifecycle(instance);

        }

        container[method](rendered.ref.realDOM, ...args);

        if(isComponentCache) {

            mountLifecycle(instance);

        }

    }

    return rendered;

}