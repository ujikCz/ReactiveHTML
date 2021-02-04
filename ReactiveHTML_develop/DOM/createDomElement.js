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

export default function createDomElement(virtualNode) {

    /**
     * create element
     */

    const el = document.createElement(virtualNode.type);

    /**
     * add attributes, but like element properties for easy manipulation
     */

    const props = virtualNode.props;

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

    const children = virtualNode.children;
    const resChildren = [];

    for (let i = 0; i < children.length; i++) {

        const elementDef = render(children[i]);

        if (isArray(elementDef)) {

            for (let j = 0; j < elementDef.length; j++) {

                const singleElementDef = elementDef[j];

                mount(singleElementDef, el, 'appendChild');

            }

        } else {

            mount(elementDef, el, 'appendChild');

        }

        resChildren.push(elementDef);

    }

    return {
        virtualNode: {
            type: virtualNode.type,
            props: virtualNode.props,
            children: resChildren,
            _key: virtualNode._key,
            _ref: virtualNode._ref
        },
        realDOM: el
    };
}