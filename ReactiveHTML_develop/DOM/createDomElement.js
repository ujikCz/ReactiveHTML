import isArray from "../isArray.js";
import isNullOrUndef from "../isNullOrUndef.js";
import isObject from "../isObject.js";
import mount from "./mount.js";
import render from "./render.js";

/**
 * creates DOM element from virtual element
 * it create only pure HTMLElements, no text nodes or smth like that
 * @param { Object } vnode 
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

        } else if (isObject(vnode.attrs[key])) { //cannot be null or undef cause isObject!!!

            Object.assign(el[key], vnode.attrs[key]);

        } else {

            if (!isNullOrUndef(vnode.attrs[key])) {

                if (key in el) {

                    el[key] = vnode.attrs[key];

                } else {

                    el.setAttribute(key, vnode.attrs[key]);

                }

            }

        }

    }

    /**
     * do everything again recursively for all children
     */

     if (vnode.children.length) {

        const children = vnode.children;

        for(let i = 0; i < children.length; i++) {

            const elementDef = render(children[i]);

            if(isArray(elementDef)) {

                for(let i = 0; i < elementDef.length; i++) {

                    mount(elementDef[i], el, 'appendChild');

                }

            } else {

                mount(elementDef, el, 'appendChild');

            }

            children[i] = elementDef;

        }

    }


    /**
     * return final element
     */

    return el;

}