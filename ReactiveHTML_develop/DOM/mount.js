

import render from "./render.js";

/**
 * used to mount element to webpage
 * @param { Object } instance 
 * @param { Element } container 
 * @param { String } method 
 * @param {*} parentComponent - experimental
 * @param  {...any} args 
 */

export default function mount(instance, container, method, parentComponent, ...args) {

    if(instance === undefined) return;

    const rendered = render(instance, container);
    
    if(rendered.ref.realDOM !== undefined) { //if rendered return no undef value

        container[method](rendered.ref.realDOM, ...args);

    }

    return rendered;

}