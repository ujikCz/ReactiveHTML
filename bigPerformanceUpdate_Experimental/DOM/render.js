import isObject from '../isObject.js';
import isArray from '../isArray.js';
import createComponentInstance from '../vnode/createComponentInstance.js';
import triggerLifecycle from '../triggerLifecycle.js';

/**
 * request idle callback on function
 * @param { Function } callback 
 */

function requestIdle(callback) {

    return window.requestAnimationFrame(callback);

};

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

            if (isArray(ch[i])) {

                for (let k = 0; k < ch[i].length; k++) {

                    render(ch[i][k], function (domChild) {

                        el.appendChild(domChild)

                    })

                }

            } else {

                render(ch[i], function (childEl) {

                    el.appendChild(childEl);

                });

            }

        }

    }

    callback(el);

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

        requestIdle(() => createDomElement(virtualElement, callback));

    } else {

        virtualElement = createComponentInstance(virtualElement);

        requestIdle(() => render(virtualElement.vnode, function (el) {

            triggerLifecycle(virtualElement.onComponentRender, virtualElement, el);

            triggerLifecycle(virtualElement.onComponentWillMount, virtualElement, el);

            virtualElement.ref.realDOM = el;

            triggerLifecycle(virtualElement.onComponentMount, virtualElement, el);

            callback(el);

        }));

    }

}