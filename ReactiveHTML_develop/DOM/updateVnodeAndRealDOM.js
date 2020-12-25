import diff from '../diff/diff.js';
import isObject from '../isObject.js';
import componentClass, { createProxyInContext } from '../vnode/component.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 */

export default function updateVnodeAndRealDOM(oldComponent) {

    oldComponent.onComponentWillUpdate(oldComponent.props);

    if (oldComponent.componentShouldUpdate() === false) {

        return oldComponent;

    }

    const newVNode = oldComponent.Element(oldComponent.props);

    newVNode.children = patchComponents(newVNode.children, oldComponent.children);

    if (oldComponent.realDOM) {

        const patch = diff(oldComponent, newVNode);
        newVNode.realDOM = patch(oldComponent.realDOM);

    }

    Object.assign(oldComponent, newVNode);

    oldComponent.onComponentUpdate(oldComponent.props);

    return oldComponent;

}

/**
 * update all components inside updated component
 * @param { updated Component children } rootChildren 
 */

function patchComponents(rootNewChildren, rootOldChildren) {

    return rootNewChildren.map((child, i) => {

        if (!isObject(child)) return child;

        if (child.type.prototype instanceof componentClass) {

            /*
             *  if component was already initialized
             */

            if (rootOldChildren[i]) {

                /*
                 *  patch existing component, not calling new instance of component
                 */

                if (deepEqual(rootOldChildren[i].__component__.props, child.props)) {

                    return rootOldChildren[i];

                }

                if (rootOldChildren[i].__component__.parentComponentShouldUpdateProps() === true) {

                    rootOldChildren[i].__component__.props = new Proxy(child.props, createProxyInContext(rootOldChildren[i].__component__));

                }

                return updateVnodeAndRealDOM(rootOldChildren[i].__component__);

            }

            /*
             *  if component was not already initialized, return whole component to render and init
             */

            return child;

        } else {

            patchComponents(child.children);
            return child;

        }

    });

}

function deepEqual(object1, object2) {

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {

        return false;

    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }

    return true;
}