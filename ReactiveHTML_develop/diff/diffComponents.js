import updateComponent from "../update/updateComponent.js";
import createComponentInstance from "../vnode/component/createComponentInstance.js";
import mountLifecycle from "../vnode/component/lifecycles/mountLifecycle.js";
import renderLifecycle from "../vnode/component/lifecycles/renderLifecycle.js";
import willMountLifecycle from "../vnode/component/lifecycles/willMountLifecycle.js";
import willUnMount from "../vnode/component/lifecycles/willUnMountLifecycle.js";
import setState from "../vnode/component/setState.js";
import diff from "./diff.js";

export default function diffComponents(oldComponent, newComponent, isVOldNodeComponent, isVNewNodeComponent) {

    /**
     * both new and old virutal nodes are components
     */

    if (isVOldNodeComponent && isVNewNodeComponent) {

        /**
         * if new and old components has the same type, update the old component
         */

        if (oldComponent.type === newComponent.type) {

            oldComponent.setState = setter => setState(oldComponent, setter, true);

            oldComponent.componentWillReceiveProps(newComponent.props);

            oldComponent.setState = setter => setState(oldComponent, setter, false);

            const update = updateComponent(oldComponent, newComponent.props, null);

            if (!update) return null;

            const [patch, snapshot] = update;

            if (!patch) return null;

            return function (node) {

                oldComponent._internals = patch(node);

                oldComponent.onComponentUpdate(snapshot);

                return {
                    virtualNode: oldComponent,
                    realDOM: node
                };

            };

        }

        /**
         * if new component has another type than old component unmount old component and create new component
         */


        return function (node) {

            const vNewNodeInstance = createComponentInstance(newComponent);

            const diffPatch = diff(oldComponent._internals.virtualNode, vNewNodeInstance._internals.virtualNode);

            if (diffPatch) {

                const patchedChild = diffPatch(node);

                vNewNodeInstance._internals = patchedChild;

            } else {

                vNewNodeInstance._internals = oldComponent._internals;

            }

            willUnMount(oldComponent);

            renderLifecycle(vNewNodeInstance);

            willMountLifecycle(vNewNodeInstance, node.parentNode);

            mountLifecycle(vNewNodeInstance, node.parentNode);

            return {
                virtualNode: vNewNodeInstance,
                realDOM: vNewNodeInstance._internals.realDOM
            };
        }

    }

    /**
     * if old is component and new is not, unmount old component and return only virtual node (not component)
     */

    if (isVOldNodeComponent && !isVNewNodeComponent) {

        return function (node) {

            const diffPatch = diff(oldComponent._internals.virtualNode, newComponent);

            if (diffPatch) {

                newComponent = diffPatch(node);

            } else {

                newComponent = oldComponent._internals.virtualNode;

            }

            willUnMount(oldComponent);

            return newComponent;

        }

    }

    /**
     * if old virtual node is not component and new is, create instance of new component and replace it with the virtual node
     */

     
    const vNewNodeInstance = createComponentInstance(newComponent);

    const diffPatch = diff(oldComponent, vNewNodeInstance._internals.virtualNode);

    return function (node) {

        if(!diffPatch) {

            vNewNodeInstance._internals = oldComponent;

            return {
                virtualNode: vNewNodeInstance,
                realDOM: node 
            };
    
        }

        vNewNodeInstance._internals = diffPatch(node);

        renderLifecycle(vNewNodeInstance);

        willMountLifecycle(vNewNodeInstance, node.parentNode);

        mountLifecycle(vNewNodeInstance, node.parentNode);

        return {
            virtualNode: vNewNodeInstance,
            realDOM: vNewNodeInstance._internals.realDOM
        };

    }

}