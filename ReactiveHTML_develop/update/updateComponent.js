import diff from '../diff/diff.js';
import memo from '../vnode/memo.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Object } nextStates - next state of states
 */

export default function updateComponent(oldComponent, newComponent) {


    if (oldComponent._memo) {

        oldComponent.onComponentCancelUpdate({ cancelType: memo });
        return () => [oldComponent.vnode, oldComponent.ref.realDOM];

    }

    oldComponent.props = newComponent.props;

    if (oldComponent.shouldComponentUpdate() === false) {

        oldComponent.onComponentCancelUpdate({ cancelType: oldComponent.onComponentCancelUpdate });
        return () => [oldComponent.vnode, oldComponent.ref.realDOM];

    }

    oldComponent.getSnapshotBeforeUpdate();

    oldComponent.onComponentWillUpdate();

    const newVNode = oldComponent.Element();

    return diff(oldComponent.vnode, newVNode);

}
