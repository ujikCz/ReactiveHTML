import diff from '../diff/diff.js';
import triggerLifecycle from '../triggerLifecycle.js';
/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Boolean } harmful - if update is harmful
 * @param { Object } nextProps - next states of props
 * @param { Object } nextStates - next state of states
 */

export default function updateComponent(oldComponent, newComponent) {
    
    if(newComponent && newComponent.props !== undefined) {

        oldComponent.props = newComponent.props;

    }

    triggerLifecycle(oldComponent.onComponentWillUpdate, oldComponent);

    const newVNode = oldComponent.Element(
        oldComponent.props, 
        oldComponent.states
    );

    const patch = diff(oldComponent.vnode, newVNode);

    newComponent.vnode = newVNode;
    Object.assign(newComponent, oldComponent);

    triggerLifecycle(oldComponent.onComponentWillUpdate, oldComponent);

    Object.assign(oldComponent.vnode, newComponent.vnode);

    triggerLifecycle(oldComponent.onComponentUpdate, oldComponent);

    return patch;

}



