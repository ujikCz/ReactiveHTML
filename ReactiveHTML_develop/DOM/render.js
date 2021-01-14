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
                    el.appendChild(renderedFromArray.ref.realDOM);

                }

                vnode.children[i] = rendered;

            } else {

                vnode.children[i] = rendered;
                el.appendChild(isObject(rendered) ? rendered.ref.realDOM : document.createTextNode(rendered));

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
    
    if(isVirtualElement(virtualElement)) {
        //element
        virtualElement.ref.realDOM = createDomElement(virtualElement);

        return virtualElement;

    }

    if(isArray(virtualElement)) {

        //array
        return virtualElement.map(virtualNode => render(virtualNode));

    } 

    if (!isObject(virtualElement)) {

        //text node
        return virtualElement;

    } 

    //component

    virtualElement = createComponentInstance(virtualElement);

    virtualElement.vnode = render(virtualElement.vnode);

    virtualElement.onComponentRender(virtualElement.vnode.ref.realDOM);

    virtualElement.onComponentWillMount(virtualElement.vnode.ref.realDOM);

    virtualElement.ref.realDOM = virtualElement.vnode.ref.realDOM;

    virtualElement.onComponentMount(virtualElement.vnode.ref.realDOM);

    return virtualElement;

}


function isVirtualElement(virtualElement) {

    if(isObject(virtualElement) && !isArray(virtualElement) && !virtualElement.type.ReactiveHTMLComponent) return true;
    return false;

}