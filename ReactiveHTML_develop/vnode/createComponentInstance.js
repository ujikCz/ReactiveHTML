
import triggerLifecycle from "../triggerLifecycle.js";

/**
 * creates virtual node tree from component
 * @param { Object } component 
 */


export default function createComponentInstance(component) {

    const instance = new component.type(component.props);

    instance.vnode = instance.Element(instance.props, instance.states);

    triggerLifecycle(instance.onComponentWillRender, instance);

    return instance;

}