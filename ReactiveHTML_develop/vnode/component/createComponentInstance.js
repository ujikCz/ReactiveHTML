

/**
 * creates instance of component
 * @param { Object } component 
 */

import filterVirtualElements from "../filterVirtualElements.js";
import checkVirtual from "./checkVirtualOfComponent.js";


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    const newVNode = checkVirtual(
        instance.Element()
    );

    instance.ref.virtual = filterVirtualElements(newVNode);

    instance._key = component._key;

    instance.type = component.type;

    return instance;

}