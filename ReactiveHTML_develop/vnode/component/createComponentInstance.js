

/**
 * creates instance of component
 * @param { Object } component 
 */

import checkVirtual from "./checkVirtualOfComponent.js";


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    instance._internals.virtual = checkVirtual(
        instance.Element()
    );

    instance._key = component._key;

    instance.type = component.type;

    return instance;

}