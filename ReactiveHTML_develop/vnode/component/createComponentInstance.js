

/**
 * creates virtual node tree from component
 * @param { Object } component 
 */


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    instance.vnode = instance.Element();

    instance.type = component.type;

    instance._key = component._key;

    return instance;

}