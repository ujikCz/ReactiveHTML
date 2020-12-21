import diff from '../diff/diff.js';
import isObject from '../isObject.js';
import componentClass from '../vnode/component.js';

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

                if (child.type.prototype.componentShouldUpdate() === false) {

                    return rootOldChildren[i];

                }

                child.type.prototype.onComponentPropsUpdate.bind(rootOldChildren[i])(child.props);

                if (child.type.prototype.componentShouldUpdateProps()) {

                    rootOldChildren[i].props = child.props;

                }

                child.type.prototype.onComponentWillUpdate.bind(rootOldChildren[i])(child.props);

                const newComponentVNode = child.type.prototype.Element.bind(rootOldChildren[i])(child.props);

                /*
                 *  assign new vnode tree and new props to existing component
                 */

                patchComponents(newComponentVNode.children, rootOldChildren[i].children);

                Object.assign(rootOldChildren[i], newComponentVNode);

                child.type.prototype.onComponentUpdate.bind(rootOldChildren[i])(child.props);


                return rootOldChildren[i];

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