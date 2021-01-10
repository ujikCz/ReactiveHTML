
import triggerLifecycle from "../triggerLifecycle.js";

/**
 * creates virtual node tree from component
 * @param { Object } component 
 */


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    instance.vnode = instance.Element(instance.props, instance.states);

    instance._key = component._key;

    Object.assign(component, instance);

    triggerLifecycle(instance.onComponentWillRender, instance);

    return component;

}