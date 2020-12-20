import diff from '../diff/diff.js';
import isObject from '../isObject.js';
import componentClass from '../vnode/component.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 */

export default function updateVnodeAndRealDOM(oldComponent) {

    oldComponent.onComponentWillUpdate(oldComponent.props);

    if(!oldComponent.componentShouldUpdate()) {

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

    return rootNewChildren.map( (child, i) => {

        if (!isObject(child)) return child;

        if (child.type.prototype instanceof componentClass) {

            if(rootOldChildren[i]) {

                child.type.prototype.onComponentPropsUpdate.bind(rootOldChildren[i])(child.props);

                if(child.type.prototype.componentShouldUpdateProps()) {

                    rootOldChildren[i].props = child.props;

                }

            }

            child.type.prototype.onComponentWillUpdate.bind(rootOldChildren[i])(child.props);

            const newComponentVNode = child.type.prototype.Element.bind(rootOldChildren[i])(child.props);
            patchComponents(newComponentVNode.children);

            if(rootOldChildren[i]) {

                Object.assign(rootOldChildren[i], newComponentVNode);

            }

            child.type.prototype.onComponentUpdate.bind(rootOldChildren[i])();

            return rootOldChildren[i] || newComponentVNode;
 
        } else {

            patchComponents(child.children);
            return child;

        }

    });

}