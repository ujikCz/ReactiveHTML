import diff from '../diff/diff.js';
import assignNewPropsAndStates from '../vnode/component/assignNewPropsAndStates.js';
import getSnapshotBeforeUpdateLifecycle from '../vnode/component/lifecycles/getSnapshotBeforeUpdate.js';

export default function updateComponent(oldComponent, nextProps, nextState) {

    /**
     * newComponent is plain javascript object { type, props, _key }
     * we use the new props that we can get updated from parent component
     */

    /**
     * should component update, if return false, component will be never updated
     */

    if(!oldComponent.shouldComponentUpdate(nextProps, nextState)) {

        oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextState);

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

    assignNewPropsAndStates(oldComponent, nextProps, nextState);

    /**
     * instead of creating new instance of component, create only new virual element of component and diff it with old one
     */

    oldComponent.onComponentWillUpdate(snapshot);

    const newVNode = oldComponent.Element();

    /**
     * using diffChildren we can manipulate with appendChild and insertBefore
     */
    
     return [diff(oldComponent._internals.virtualNode, newVNode), snapshot];

}


