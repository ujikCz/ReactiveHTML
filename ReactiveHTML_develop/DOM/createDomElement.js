import isArray from "../isArray.js";
import isNullOrUndef from "../isNullOrUndef.js";
import isObject from "../isObject.js";
import ElementDefinition from "./elementDefinition.js";
import mount from "./mount.js";
import render from "./render.js";

/**
 * creates DOM element from virtual element
 * it create only pure HTMLElements, no text nodes or smth like that
 * @param { Object } vnode 
 */

export default function createDomElement(tagName, props, children) {

    /**
     * create element
     */

    const el = document.createElement(tagName);

    /**
     * add attributes, but like element properties for easy manipulation
     */

    for(const key in props) {

        if (key.startsWith('on')) {

            el.addEventListener(key.replace('on', ''), props[key]);

        } else if (isObject(props[key])) { //cannot be null or undef cause isObject!!!

            Object.assign(el[key], props[key]);

        } else {

            if (!isNullOrUndef(props[key])) {

                if (key in el) {

                    el[key] = props[key];

                } else {

                    el.setAttribute(key, props[key]);

                }

            }

        }

    }


    for (let i = 0; i < children.length; i++) {

        const child = children[i];

        const elementDef = render(child);

        if (isArray(elementDef)) {

            for (let j = 0; j < elementDef.length; j++) {

                const singleElementDef = elementDef[j];

                mount(singleElementDef, el, 'appendChild');

            }

        } else {

            mount(elementDef, el, 'appendChild');

        }

        children[i] = elementDef;

    }

    return new ElementDefinition({
        virtualNode: {
            type: tagName, 
            props,
            children
        },
        realDOM: el
    });
}