import isObject from '../isObject.js';
import isArray from '../isArray.js';
import createComponentInstance from '../vnode/createComponentInstance.js';
import triggerLifecycle from '../triggerLifecycle.js';
import {
    requestIdleCallbackPolyfill,
    cancelIdleCallbackPolyfill
} from '../polyfill/requestIdleCallback.js';

/**
 * render virtual node (create real node from virtual node)
 * @param { Object } vnode 
 */

function whenYouCanNoLaterThen(callback) {

    const schedule = () => requestIdleCallbackPolyfill(deadline => {

        if (deadline.timeRemaining() > 1) return callback();

        schedule();
    });

    schedule();
}

function createDomElement(vnode, callback) {

    if (!isObject(vnode)) {

        return callback(document.createTextNode(vnode));

    }

    if (isArray(vnode)) {

        return callback(vnode.map(singleVirtualElement => render(singleVirtualElement, el => el)));

    }

    const el = document.createElement(vnode.type);

    for (const key in vnode.attrs) {

        const value = vnode.attrs[key];

        if (key === 'style') {

            for (const styleKey in value) {

                el.style[styleKey] = value[styleKey];

            }

        } else {

            if (key.startsWith('on')) {

                el.addEventListener(key.replace('on', ''), value);

            } else {

                el.setAttribute(key, value);

            }

        }

    }

    if(vnode.children.length) {

        for(let i = 0, ch = vnode.children; i < ch.length; i++) {

            if (isArray(ch[i])) {
                
                for(let k = 0; k < ch[i].length; k++) {

                    render(ch[i][k], function(domChild) {

                        el.appendChild(domChild)
    
                    })

                }

            } else {

                render(ch[i], function(childEl) {

                    el.appendChild(childEl);

                });

            }

        }

    }

    return callback(el);

}




/**
 * render the virtualNode 
 * rendered virtualNode is not mounted, but it is now HTML element
 * @param { Object } virtualElement - component or vNode object
 */

export default function render(virtualElement, callback) {

    if (!isObject(virtualElement) || isArray(virtualElement) || !virtualElement.type.ReactiveHTMLComponent) {

        return whenYouCanNoLaterThen(() => createDomElement(virtualElement, callback));

    }

    virtualElement = Object.assign(virtualElement, createComponentInstance(virtualElement));

    return whenYouCanNoLaterThen(() => render(virtualElement.vnode, function(el) {

        virtualElement.__component__.realDOM = el;

        triggerLifecycle(virtualElement.__component__.onComponentRender, virtualElement, el);

        triggerLifecycle(virtualElement.__component__.onComponentWillMount, virtualElement, el);

        callback(el);

        triggerLifecycle(virtualElement.__component__.onComponentMount, virtualElement, el);

    }));

}