import diff from '../diff/diff.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Object } nextStates - next state of states
 */

export default function updateComponent(oldComponent, newComponent) {

    if (oldComponent._memo) {

        return () => undefined;

    }

    if (oldComponent.shouldComponentUpdate() === false) {

        oldComponent.onComponentCancelUpdate();
        return () => undefined;

    }

    oldComponent.getSnapshotBeforeUpdate();

    oldComponent.props = newComponent.props;

    oldComponent.onComponentWillUpdate();

    const newVNode = oldComponent.Element();

    const patch = diff(oldComponent.vnode, newVNode);

    oldComponent.vnode = newVNode;
    
    oldComponent.onComponentUpdate();

    return patch;

}

export function updateTreeWithComponent(oldComponent, newComponent) {

    return diff(oldComponent.vnode || oldComponent, newComponent.vnode || newComponent);

}
