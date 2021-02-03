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

    const vNodeProps = vnode.props;

    for(const key in vNodeProps) {

        if (key.startsWith('on')) {

            el.addEventListener(key.replace('on', ''), vNodeProps[key]);

        } else if (isObject(vNodeProps[key])) { //cannot be null or undef cause isObject!!!

            Object.assign(el[key], vNodeProps[key]);

        } else {

            if (!isNullOrUndef(vNodeProps[key])) {

                if (key in el) {

                    el[key] = vNodeProps[key];

                } else {

                    el.setAttribute(key, vNodeProps[key]);

                }

            }

        }

    }

    const children = vnode.children;

    for (let i = 0; i < children.length; i++) {

        const child = children[i];

        const elementDef = render(child);

        if (isArray(elementDef)) {

            for (let j = 0; j < elementDef.length; j++) {

                const singleElementDef = elementDef[j];

                mount(singleElementDef, el, 'appendChild');

                child[j] = singleElementDef.virtualNode;
            }

        } else {

            mount(elementDef, el, 'appendChild');

            children[i] = elementDef.virtualNode;

        }

    }

    return {
        realDOM: el,
        virtualNode: vnode
    };
}