
import triggerLifecycle from "../triggerLifecycle.js";

/**
 * creates virtual node tree from component
 * @param { Object } component 
 */


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    instance.vnode = instance.Element(instance.props, instance.states);

    Object.setPrototypeOf(component, Object.getPrototypeOf(instance));

    triggerLifecycle(instance.onComponentWillRender, instance);

    Object.assign(component, instance);

    return component;

}