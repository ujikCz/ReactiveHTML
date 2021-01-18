import diff from '../diff/diff.js';
import assignNewPropsAndStates from '../vnode/component/assignNewPropsAndStates.js';
import componentBeforeUpdateLifecycles from '../vnode/component/componentBeforeUpdateLifecycles.js';
import memo from '../memo.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Object } nextStates - next state of states
 */

export default function updateComponent(oldComponent, newComponent, nextStates) {

    if (oldComponent._memo) {

        oldComponent.onComponentCancelUpdate({ cancelType: memo });
        return () => [oldComponent.vnode, oldComponent.ref.realDOM];

    }

    if (oldComponent.shouldComponentUpdate(newComponent.props, nextStates) === false) {

        oldComponent = assignNewPropsAndStates(oldComponent, newComponent.props, nextStates);

        oldComponent.onComponentCancelUpdate({ cancelType: oldComponent.onComponentCancelUpdate });
        return () => [oldComponent.vnode, oldComponent.ref.realDOM];

    }

    let snapshot = null;

    if(oldComponent.getSnapshotBeforeUpdate) {

        snapshot = oldComponent.getSnapshotBeforeUpdate(oldComponent.props, oldComponent.states) || null;

    }

    oldComponent = assignNewPropsAndStates(oldComponent, newComponent.props, nextStates);

    const newVNode = oldComponent.Element();

    componentBeforeUpdateLifecycles(oldComponent, newVNode, snapshot);

    return [diff(oldComponent.vnode, newVNode), snapshot];

}


