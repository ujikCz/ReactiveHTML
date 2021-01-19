import isArray from "../isArray.js";
import isObject from "../isObject.js";
import mount from "./mount.js";
import filterVirtualElements from "../vnode/filterVirtualElements.js";

/**
 * creates DOM element from virtual element
 * it create only pure HTMLElements, no text nodes or smth like that
 * @param { Object } vnode 
 * @param {*} parentComponent - experimental 
 */

export default function createDomElement(vnode, parentComponent) {

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

        for (let i = 0, ch = vnode.children; i < ch.length; i++) {

            const filtered = filterVirtualElements(ch[i]);

            if(isArray(filtered)) {

                for(let j = 0; j < filtered.length; j++) {

                    const filteredFromArray = filterVirtualElements(filtered[j]);
                    filtered[j] = filteredFromArray;
                    mount(filteredFromArray, el, 'appendChild', parentComponent);

                }

            } else {

                console.log(parentComponent)
                mount(filtered, el, 'appendChild', parentComponent);

            }

            vnode.children[i] = filtered;

        }

    }

    /**
     * return final element
     */

    return el;

}