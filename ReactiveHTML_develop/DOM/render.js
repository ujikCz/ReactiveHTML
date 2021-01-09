import isObject from '../isObject.js';
import isArray from '../isArray.js';
import createComponentInstance from '../vnode/createComponentInstance.js';
import triggerLifecycle from '../triggerLifecycle.js';
import requestIdleCallbackPolyfill from '../polyfill/requestIdleCallback.js';

window.requestIdleCallback = window.requestIdleCallback || requestIdleCallbackPolyfill;

/**
 * request idle callback on function
 * @param { Function } callback 
 */

function req(callback) {

    const schedule = () => window.requestIdleCallback(deadline => {

        if (deadline.timeRemaining() > 1) return callback();

        schedule();
    });

    schedule();
}

/**
 * render virtual node (create real node from virtual node)
 * recursion to create DOM is so heavy operation, to solve this problem we request idle callback
 * @param { Object } vnode - virtual node element
 * @param { Function } callback - after render is done call callback with rendered element
 */

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
  * mount rendered element
  * use idle callback
  * @param { Class || Object } virtualElement - class or object that represent virtual dom or component
  * @param { Function } callback - triggered after rendered to mount
  */


export default function render(virtualElement, callback) {

    if (!isObject(virtualElement) || isArray(virtualElement) || !virtualElement.type.ReactiveHTMLComponent) {

        return req(() => createDomElement(virtualElement, callback));

    }

    virtualElement = Object.assign(virtualElement, createComponentInstance(virtualElement));

    return req(() => render(virtualElement.vnode, function(el) {

        virtualElement.__component__.realDOM = el;

        triggerLifecycle(virtualElement.__component__.onComponentRender, virtualElement, el);

        triggerLifecycle(virtualElement.__component__.onComponentWillMount, virtualElement, el);

        callback(el);

        triggerLifecycle(virtualElement.__component__.onComponentMount, virtualElement, el);

    }));

}