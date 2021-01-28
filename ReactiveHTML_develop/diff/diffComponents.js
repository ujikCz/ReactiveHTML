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

            return function (node) {

                oldComponent.setState = function(setter) {

                    return setState(oldComponent, setter, true); //setState don't rerender element in additional
                
                };                

                oldComponent.componentWillReceiveProps(newComponent.props);

                oldComponent.setState = function(setter) {

                    return setState(oldComponent, setter, false); //all synchronnous setState will cause only one rerender on update
                
                };

                /**
                 * same as in component.js
                 */

                const update = updateComponent(oldComponent, newComponent.props, null);

                if (update) {

                    const [patch, snapshot] = update;
                    [oldComponent._internals.virtual, oldComponent._internals.realDOM] = patch(node);
                    oldComponent.onComponentUpdate(snapshot);

                }  

                return [oldComponent, node];

            }

        }

        /**
         * if new component has another type than old component unmount old component and create new component
         */

        return function (node) {

            const vNewNodeInstance = createComponentInstance(newComponent);

            willUnMount(oldComponent);

            [vNewNodeInstance._internals.virtual, vNewNodeInstance._internals.realDOM] = diff(oldComponent._internals.virtual, vNewNodeInstance._internals.virtual)(node);

            renderLifecycle(vNewNodeInstance);

            willMountLifecycle(vNewNodeInstance, node.parentNode);

            mountLifecycle(vNewNodeInstance, node.parentNode);

            return [vNewNodeInstance, node];

        }

    }

    /**
     * if old is component and new is not, unmount old component and return only virtual node (not component)
     */

    if (isVOldNodeComponent && !isVNewNodeComponent) {

        return function (node) {

            const patch = diff(oldComponent._internals.virtual, newComponent);

            [newComponent, node] = patch(node);

            willUnMount(oldComponent);

            return [newComponent, node];

        }

    }

    /**
     * if old virtual node is not component and new is, create instance of new component and replace it with the virtual node
     */

    return function (node) {

        const vNewNodeInstance = createComponentInstance(newComponent);

        [vNewNodeInstance._internals.virtual, vNewNodeInstance._internals.realDOM] = diff(oldComponent, vNewNodeInstance._internals.virtual)(node);

        renderLifecycle(vNewNodeInstance);

        willMountLifecycle(vNewNodeInstance, node.parentNode);

        mountLifecycle(vNewNodeInstance, node.parentNode);

        return [vNewNodeInstance, node];

    }

}