
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

            const eventName = key.replace('on', '');
            el.addEventListener(eventName, vnode.attrs[key]);

        } else if (isObject(vnode.attrs[key])) { //cannot be null or undef cause isObject!!!

            Object.assign(el[key], vnode.attrs[key]);

        } else {

            if(!isNullOrUndef(vnode.attrs[key])) {

                if(key in el) {

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

        const childrenFrag = document.createDocumentFragment();

        for (let i = 0, children = vnode.children; i < children.length; i++) {

            const vNewNode = render(children[i]);
            
            mount(vNewNode, childrenFrag, 'appendChild');

            if(vNewNode) {

                children[i] = applyToVirtualNode(vNewNode);

            }

        }

        el.appendChild(childrenFrag);

    }

    /**
     * return final element
     */

    return el;

}

function applyToVirtualNode(newNodeDefinition) {

    if(isArray(newNodeDefinition)) {

        return newNodeDefinition.map(siglenewNodeDefinition => siglenewNodeDefinition.virtualNode);

    } else {

        return newNodeDefinition.virtualNode;

    }

}