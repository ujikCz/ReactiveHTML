import isComponent from "../isComponent.js";
import isObject from "../isObject.js";
import createDOMfromRenderedVirtualNode from "./createDOMfromRenderedVirtualNode.js";


export default function mount(instance, container, method, ...args) {

    const elementFromInstance = createDOMfromRenderedVirtualNode(instance);

    const isComponentCache = isObject(instance) && isComponent(instance.type);

    if(isComponentCache) {

        instance.onComponentWillMount(elementFromInstance);

    }

    container[method](elementFromInstance, ...args);

    if(isComponentCache) {

        instance.onComponentMount(elementFromInstance);

    }

    return elementFromInstance;

}