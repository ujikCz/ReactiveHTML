import diff from '../diff/diff.js';
import assignNewPropsAndStates from '../vnode/component/assignNewPropsAndStates.js';
import checkVirtual from '../vnode/component/checkVirtualOfComponent.js';
import getSnapshotBeforeUpdateLifecycle from '../vnode/component/lifecycles/getSnapshotBeforeUpdate.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Object } nextStates - next state of states
 */

export default function updateComponent(oldComponent, nextProps, nextStates) {

    /**
     * newComponent is plain javascript object { type, props, _key }
     * we use the new props that we can get updated from parent component
     */

    /**
     * should component update, if return false, component will be never updated
     */

    if(!oldComponent.shouldComponentUpdate(nextProps, nextStates)) {

        oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextStates);

        oldComponent.onComponentCancelUpdate();

        return false;

    }

    /**
     * if you want get the snapshot of component before update
     */

    const snapshot = getSnapshotBeforeUpdateLifecycle(oldComponent);

    /**
     * if should component update return true, component will be updated as normally
     */

    oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextStates);

    /**
     * instead of creating new instance of component, create only new virual element of component and diff it with old one
     */

    oldComponent.onComponentWillUpdate(snapshot);

    const newVNode = checkVirtual(
        oldComponent.Element()
    );

    /**
     * using diffChildren we can manipulate with appendChild and insertBefore
     */

     return [diff(oldComponent.ref.virtual, newVNode), snapshot];

}


