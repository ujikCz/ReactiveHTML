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

    console.log(oldComponent, newComponent, isVOldNodeComponent, isVNewNodeComponent);

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

                    const [[patch, changes], snapshot] = update;
                    if(changes) {

                        oldComponent._internals.virtualNode = patch(node);

                    }

                    oldComponent.onComponentUpdate(snapshot);

                }  

                return oldComponent;

            };

        }

        /**
         * if new component has another type than old component unmount old component and create new component
         */ 


        return function () {

            const node = oldComponent._internals.realDOM;
            const vNewNodeInstance = createComponentInstance(newComponent);

            const [diffPatch, diffChanges] = diff(oldComponent._internals.virtualNode, vNewNodeInstance._internals.virtualNode);

            if(diffChanges) {

                vNewNodeInstance._internals.virtualNode = diffPatch(node);

            } else {

                vNewNodeInstance._internals.virtualNode = oldComponent._internals.virtualNode;

            }

            willUnMount(oldComponent);

            renderLifecycle(vNewNodeInstance);

            willMountLifecycle(vNewNodeInstance, node.parentNode);

            mountLifecycle(vNewNodeInstance, node.parentNode);

            return vNewNodeInstance;

        }

    }

    /**
     * if old is component and new is not, unmount old component and return only virtual node (not component)
     */

    if (isVOldNodeComponent && !isVNewNodeComponent) {

        return function () {

            const node = oldComponent._internals.realDOM;
            const [diffPatch, diffChanges] = diff(oldComponent._internals.virtualNode, newComponent);
            
            if(diffChanges) {
                
                newComponent.virtualNode = diffPatch(node);

            } 

            newComponent.realDOM = node;

            willUnMount(oldComponent);

            return newComponent;

        }

    }

    /**
     * if old virtual node is not component and new is, create instance of new component and replace it with the virtual node
     */

    return function (node) {

        const vNewNodeInstance = createComponentInstance(newComponent);

        const [diffPatch, diffChanges] = diff(oldComponent, vNewNodeInstance._internals.virtualNode);

        vNewNodeInstance._internals = {
            virtualNode: diffChanges ? diffPatch(node) : oldComponent,
            realDOM: node
        };

        renderLifecycle(vNewNodeInstance);

        willMountLifecycle(vNewNodeInstance, node.parentNode);

        mountLifecycle(vNewNodeInstance, node.parentNode);

        return vNewNodeInstance;

    }

}