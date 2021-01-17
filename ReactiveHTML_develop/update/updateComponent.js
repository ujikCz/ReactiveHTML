import diff from '../diff/diff.js';
import isObject from '../isObject.js';
import memo from '../vnode/memo.js';

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

    if(oldComponent.getSnapshotBeforeUpdate) {

        oldComponent.getSnapshotBeforeUpdate({ ...oldComponent.props }, { ...oldComponent.states });

    }

    oldComponent = assignNewPropsAndStates(oldComponent, newComponent.props, nextStates);

    oldComponent.onComponentWillUpdate();

    const newVNode = oldComponent.Element();

    return diff(oldComponent.vnode, newVNode);

}

function assignNewPropsAndStates(oldComponent, nextProps, nextStates) {

    if(isObject(nextProps)) {

        Object.assign(oldComponent.props, nextProps);

    }

    if(isObject(nextStates)) {

        Object.assign(oldComponent.states, nextStates);

    }

    return oldComponent;

}
