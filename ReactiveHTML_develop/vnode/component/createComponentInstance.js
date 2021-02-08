

/**
 * creates instance of component
 * @param { Object } component 
 */


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    instance._internals.virtualNode = instance.Element(instance.props, instance.state);

    instance.type = component.type;

    return instance;

}