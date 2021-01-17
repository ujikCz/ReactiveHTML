import isObject from '../isObject.js';
import isArray from '../isArray.js';
import createComponentInstance from '../vnode/createComponentInstance.js';

/**
 * request idle callback on function
 * @param { Function } callback 
 */

function requestIdle(callback) {

    return window.requestAnimationFrame(callback);

};

export function createDOMfromRenderedVirtualNode(virtualNode) {

    if(isVirtualElement(virtualNode)) {

        //element
        return createDomElement(virtualNode);

    }

    if(isObject(virtualNode)) {

        //virtualNode
        return virtualNode.ref.realDOM;

    }

    //text node
    return document.createTextNode(virtualNode);

}

/**
 * render virtual node (create real node from virtual node)
 * recursion to create DOM is so heavy operation, to solve this problem we request idle callback
 * @param { Object } vnode - virtual node element
 * @param { Function } callback - after render is done call callback with rendered element
 */

function createDomElement(vnode) {

    const el = document.createElement(vnode.type);

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

    if (vnode.children.length) {

        for (let i = 0, ch = vnode.children; i < ch.length; i++) {

            const rendered = render(ch[i]);

            if(isArray(rendered)) {

                for(let j = 0; j < rendered.length; j++) {

                    const renderedFromArray = render(rendered[j]);
                    rendered[j] = renderedFromArray;
                    el.appendChild(createDOMfromRenderedVirtualNode(renderedFromArray));

                }

                vnode.children[i] = rendered;

            } else {

                vnode.children[i] = rendered;
                el.appendChild(createDOMfromRenderedVirtualNode(rendered));

            }

        }

    }

    return el;

}

/**
 * render the virtualNode 
 * mount rendered element
 * use idle callback
 * @param { Class || Object } virtualElement - class or object that represent virtual dom or component
 * @param { Function } callback - triggered after rendered to mount
 */


export default function render(virtualElement) {

    if(isVirtualElement(virtualElement) || !isObject(virtualElement)) {
        //element 
        //OR
        //text node

        return virtualElement;

    }

    if(isArray(virtualElement)) {

        //array
        return virtualElement.map(virtualNode => render(virtualNode));

    } 

    //component

    virtualElement = createComponentInstance(virtualElement);

    virtualElement.vnode = render(virtualElement.vnode);

    const componentHookedNode = createDOMfromRenderedVirtualNode(virtualElement.vnode);

    virtualElement.onComponentRender(componentHookedNode);

    virtualElement.onComponentWillMount(componentHookedNode);

    virtualElement.ref.realDOM = componentHookedNode;

    virtualElement.onComponentMount(componentHookedNode);

    return virtualElement;

}


function isVirtualElement(virtualElement) {

    if(isObject(virtualElement) && !isArray(virtualElement) && !virtualElement.type.ReactiveHTMLComponent) return true;
    return false;

}