

/**
 * creates instance of component
 * @param { Object } component 
 */


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    const newVNode = instance.Element();

    instance.virtual = newVNode;

    instance._key = component._key;

    instance.type = component.type;

    return instance;

}