import mount from "../DOM/mount.js";
import render from "../DOM/render.js";
import updateComponent from "../update/updateComponent.js";
import createComponentInstance from "../vnode/component/createComponentInstance.js";
import filterVirtualElements from "../vnode/filterVirtualElements.js";
import diff from "./diff.js";

export default function diffComponents(oldComponent, newComponent, isVOldNodeComponent, isVNewNodeComponent) {

    if(oldComponent === null) {

        return function (node, parentNode) {

            newComponent = filterVirtualElements(newComponent);

            const rendered = render(newComponent, parentNode);

            node = mount(newComponent, rendered, parentNode, 'appendChild');

            return [newComponent, node];

        }

    }

    if (newComponent === null) {

        return function (node, parentNode) {

            willUnMount(oldComponent);

            node.remove();

            return [null, null];

        };

    }

    if (isVOldNodeComponent && isVNewNodeComponent) {

        if (oldComponent.type === newComponent.type) {

            return function (node, parentNode) {

                const [patch, snapshot] = updateComponent(oldComponent, newComponent.props, null);
                [oldComponent.ref.virtual, oldComponent.ref.realDOM] = patch(oldComponent.ref.realDOM, oldComponent.ref.container);

                return [oldComponent, node];

            }

        }

        return function (node, parentNode) {

            const vNewNodeInstance = createComponentInstance(newComponent);

            [vNewNodeInstance.vnode, node] = diff(oldComponent.vnode, vNewNodeInstance.vnode)(node);

            vNewNodeInstance.ref.realDOM = node;

            oldComponent.ref.realDOM = null;

            return [vNewNodeInstance, node];

        }

    }

    if (isVOldNodeComponent && !isVNewNodeComponent) {

        return function (node, parentNode) {

            const patch = diff(oldComponent.vnode, newComponent);

            [newComponent, node] = patch(node);

            oldComponent.ref.realDOM = null;

            return [newComponent, node];

        }

    }

    if (!isVOldNodeComponent && isVNewNodeComponent) {

        return function (node, parentNode) {

            const vNewNodeInstance = createComponentInstance(newComponent);

            const patch = diff(oldComponent, vNewNodeInstance.vnode);

            [newComponent, node] = patch(node);

            vNewNodeInstance.ref.realDOM = node;

            return [newComponent, node];

        }

    }

}