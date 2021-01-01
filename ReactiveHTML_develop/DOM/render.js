import isObject from '../isObject.js';
import componentClass from '../vnode/component.js';

/**
 * creates virtual node tree from component
 * @param { Object } component 
 */

function getVnodeFromComponent(component) {

    const instance = new component.type(component.props);

    instance.vnode = instance.Element(instance.props, instance.states);
    return instance;

}

/**
 * render virtual node (create real node from virtual node)
 * @param { Object } vnode 
 */

function createDomElement(vnode) {

    const el = document.createElement(vnode.type);

    for (const [k, v] of Object.entries(vnode.attrs.basic)) {
        el.setAttribute(k, v);
    }

    for (const [k, v] of Object.entries(vnode.attrs.events)) {
        el.addEventListener(k, v);
    }

    for (const [k, v] of Object.entries(vnode.attrs.styles)) {
        el.style[k] = v;
    }

    vnode.children.forEach(child => {

        if (Array.isArray(child)) {

            const childGroup = child.map(singleChild => render(singleChild));
            childGroup.forEach(domChild => el.appendChild(domChild));

        } else {

            const childEl = render(child);
            el.appendChild(childEl);

        }

    });

    return el;

}

/**
 * render the virtualNode 
 * rendered virtualNode is not mounted, but it is now HTML element
 * @param { Object } component - component or vNode object
 */

export default function render(virtualElement) {

    if (!isObject(virtualElement)) {

        return document.createTextNode(virtualElement);

    }

    if (Array.isArray(virtualElement)) {

        return virtualElement.map(singleVirtualElement => render(singleVirtualElement));

    }

    if (virtualElement.type.prototype instanceof componentClass) {

        const instance = getVnodeFromComponent(virtualElement);
        instance.realDOM = render(instance.vnode);

        instance.onComponentRender();

        Object.assign(virtualElement, instance);

        return virtualElement.realDOM;

    }

    return createDomElement(virtualElement);

}