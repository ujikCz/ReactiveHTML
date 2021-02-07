import applyComponentUpdate from "../update/applyComponentUpdate.js";
import updateComponent from "../update/updateComponent.js";
import createComponentInstance from "../vnode/component/createComponentInstance.js";
import willGetPropsLifecycle from "../vnode/component/lifecycles/willGetPropsLifecycle.js";
import componentWillUnMount from "../vnode/component/lifecycles/willUnMount/willUnMountLifecycle.js";
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

            const nextState = willGetPropsLifecycle(oldComponent, newComponent.props);

            const update = updateComponent(oldComponent, newComponent.props, nextState);

            return applyComponentUpdate(update, (patch, snapshot) => function (node) {

                const patchedChild = patch(node);

                Object.assign(vNewNodeInstanceInternals, {
                    virtualNode: patchedChild.virtualNode,
                    realDOM: patchedChild.realDOM
                });

                oldComponent.onComponentUpdate(snapshot);

                return {
                    virtualNode: oldComponent,
                    realDOM: node,
                    _key: oldComponent._key
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

        componentWillUnMount(oldComponent);

        return function (node) {

            vNewNodeInstance.onComponentWillMount(node, node.parentNode);

            const patchedChild = diffPatch ? diffPatch(node) : vOldNodeInstanceInternals;

            Object.assign(vNewNodeInstanceInternals, {
                virtualNode: patchedChild.virtualNode,
                realDOM: patchedChild.realDOM
            });

            const realDOMofNewComponent = vNewNodeInstanceInternals.realDOM;
            vNewNodeInstance.onComponentMount(realDOMofNewComponent, realDOMofNewComponent.parentNode);

            return {
                virtualNode: vNewNodeInstance,
                realDOM: realDOMofNewComponent,
                _key: vNewNodeInstance._key
            };
        }

    }

    /**
     * if old is component and new is not, unmount old component and return only virtual node (not component)
     */

    if (isVOldNodeComponent && !isVNewNodeComponent) {
        
        const vOldNodeInstanceInternals = oldComponent._internals;

        const diffPatch = diff(vOldNodeInstanceInternals.virtualNode, newComponent);

        componentWillUnMount(oldComponent);

        if(diffPatch) {

            return node => diffPatch(node);

        } else {

            return node => ({
                virtualNode: vOldNodeInstanceInternals.virtualNode,
                realDOM: node,
                _key: newComponent._key
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

        vNewNodeInstance.onComponentWillMount(node, node.parentNode);

        const patchedChild = diffPatch ? diffPatch(node) : { virtualNode: oldComponent, realDOM: node };

        Object.assign(vNewNodeInstanceInternals, {
            virtualNode: patchedChild.virtualNode,
            realDOM: patchedChild.realDOM
        });

        const realDOMofComponent = vNewNodeInstanceInternals.realDOM;
        vNewNodeInstance.onComponentMount(realDOMofComponent, realDOMofComponent.parentNode);

        return {
            virtualNode: vNewNodeInstance,
            realDOM: realDOMofComponent,
            _key: vNewNodeInstance._key
        };

    }

}