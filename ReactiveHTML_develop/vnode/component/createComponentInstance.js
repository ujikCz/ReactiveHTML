

/**
 * creates virtual node tree from component
 * @param { Object } component 
 */


export default function createComponentInstance(component) {
    
    const instance = new component.type(component.props);

    instance.vnode = instance.Element();
    console.log(new component.type({}))
    instance.type = component.type;

    instance._key = component._key;

    return instance;

}