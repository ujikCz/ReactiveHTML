import diff from '../diff/diff.js';
import diffChildren from '../diff/diffChildren.js';
import assignNewPropsAndStates from '../vnode/component/assignNewPropsAndStates.js';
import checkVirtual from '../vnode/component/checkVirtualOfComponent.js';
import getSnapshotBeforeUpdateLIfecycle from '../vnode/component/lifecycles/getSnapshotBeforeUpdate.js';
import shouldComponentUpdateLifecycle from '../vnode/component/lifecycles/shouldComponentUpdate.js';
import willUpdateLIfecycle from '../vnode/component/lifecycles/willUpdateLifecycle.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Object } nextStates - next state of states
 */

export default function updateComponent(oldComponent, newComponent, nextStates) {

    /**
     * newComponent is plain javascript object { type, props, _key }
     * we use the new props that we can get updated from parent component
     */

    const nextProps = newComponent.props;

    /**
     * should component update, if return false, component will be never updated
     */

    if(shouldComponentUpdateLifecycle(oldComponent, nextProps, nextStates) === false) {

        oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextStates);
        return () => [[oldComponent.virtual], oldComponent.ref.container];

    }

    /**
     * if you want get the snapshot of component before update
     */

    const snapshot = getSnapshotBeforeUpdateLIfecycle(oldComponent);

    /**
     * if should component update return true, component will be updated as normally
     */

    oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextStates);

    /**
     * instead of creating new instance of component, create only new virual element of component and diff it with old one
     */

    willUpdateLIfecycle(oldComponent, snapshot);

    const newVNode = checkVirtual(
        oldComponent.Element()
    );

    /**
     * using diffChildren we can manipulate with appendChild and insertBefore
     */


    return [diffChildren([oldComponent.ref.virtual], [newVNode]), snapshot];

}


