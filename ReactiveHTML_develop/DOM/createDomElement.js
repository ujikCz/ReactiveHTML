import isArray from "../isArray.js";
import isObject from "../isObject.js";
import mount from "./mount.js";
import filterVirtualElements from "../vnode/filterVirtualElements.js";
import render from "./render.js";

/**
 * creates DOM element from virtual element
 * it create only pure HTMLElements, no text nodes or smth like that
 * @param { Object } vnode 
 * @param {*} parentComponent - experimental 
 */

export default function createDomElement(vnode) {

    /**
     * create element
     */

    const el = document.createElement(vnode.type);

    /**
     * add attributes, but like element properties for easy manipulation
     */

    for (const key in vnode.attrs) {

        if (key.startsWith('on')) {

            el.addEventListener(key.replace('on', ''), vnode.attrs[key]);
            continue;

        } else if (isObject(vnode.attrs[key])) {

            Object.assign(el[key], vnode.attrs[key]);
            continue;

        } else {

            el[key] = vnode.attrs[key];

        }

    }

    /**
     * do everything again recursively for all children
     */

    if (vnode.children.length) {

        for (let i = 0, children = vnode.children; i < children.length; i++) {

            const filtered = filterVirtualElements(children[i]);
            const rendered = render(filtered, el);
            console.log(rendered)
            mount(filtered, rendered, el, 'appendChild');

            vnode.children[i] = filtered;

        }

    }

    /**
     * return final element
     */

    return el;

}