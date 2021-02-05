import applyComponentUpdate from "../update/applyComponentUpdate.js";
import updateComponent from "../update/updateComponent.js";
import createComponentInstance from "../vnode/component/createComponentInstance.js";
import mountLifecycle from "../vnode/component/lifecycles/mountLifecycle.js";
import willMountLifecycle from "../vnode/component/lifecycles/willMountLifecycle.js";
import willReceiveProps from "../vnode/component/lifecycles/willReceiveProps.js";
import willUnMount from "../vnode/component/lifecycles/willUnMountLifecycle.js";
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

            willReceiveProps(oldComponent, newComponent.props);

            const update = updateComponent(oldComponent, newComponent.props, null);

            return applyComponentUpdate(update, (patch, snapshot) => function (node) {

                const patchedChild = patch(node);

                Object.assign(vNewNodeInstanceInternals, {
                    virtualNode: patchedChild.virtualNode,
                    realDOM: patchedChild.realDOM
                });

                oldComponent.onComponentUpdate(snapshot);

                return {
                    virtualNode: oldComponent,
                    realDOM: node
                };

            }, null);

        }

        /**
         * if new component has another type than old component unmount old component and create new component
         */
        
        const vNewNodeInstance = createComponentInstance(newComponent);

        const vNewNodeInstanceInternals = vNewNodeInstance._internals;
        const vOldNodeInstanceInternals = oldComponent._internals;

        const diffPatch = diff(vOldNodeInstanceInternals.virtualNode, vNewNodeInstance._internals.virtualNode);

        willUnMount(oldComponent);

        return function (node) {

            const patchedChild = diffPatch ? diffPatch(node) : vOldNodeInstanceInternals;

            Object.assign(vNewNodeInstanceInternals, {
                virtualNode: patchedChild.virtualNode,
                realDOM: patchedChild.realDOM
            });

            willMountLifecycle(vNewNodeInstance, node.parentNode);

            mountLifecycle(vNewNodeInstance, node.parentNode);

            return {
                virtualNode: vNewNodeInstance,
                realDOM: vNewNodeInstanceInternals.realDOM
            };
        }

    }

    /**
     * if old is component and new is not, unmount old component and return only virtual node (not component)
     */

    if (isVOldNodeComponent && !isVNewNodeComponent) {
        
        const vOldNodeInstanceInternals = oldComponent._internals;

        const diffPatch = diff(vOldNodeInstanceInternals.virtualNode, newComponent);

        willUnMount(oldComponent);

        if(diffPatch) {

            return node => diffPatch(node);

        } else {

            return node => ({
                virtualNode: vOldNodeInstanceInternals.virtualNode,
                realDOM: node
            });

        }

    }

    /**
     * if old virtual node is not component and new is, create instance of new component and replace it with the virtual node
     */


    const vNewNodeInstance = createComponentInstance(newComponent);
    const vNewNodeInstanceInternals = vNewNodeInstance._internals;

    const diffPatch = diff(oldComponent, vNewNodeInstanceInternals.virtualNode);

    return function (node) {

        const patchedChild = diffPatch ? diffPatch(node) : { virtualNode: oldComponent, realDOM: node };

        Object.assign(vNewNodeInstanceInternals, {
            virtualNode: patchedChild.virtualNode,
            realDOM: patchedChild.realDOM
        });

        willMountLifecycle(vNewNodeInstance, node.parentNode);

        mountLifecycle(vNewNodeInstance, node.parentNode);

        return {
            virtualNode: vNewNodeInstance,
            realDOM: vNewNodeInstanceInternals.realDOM
        };

    }

}