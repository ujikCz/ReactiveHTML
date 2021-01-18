import isComponent from "../isComponent.js";
import createDOMfromRenderedVirtualNode from "./createDOMfromRenderedVirtualNode.js";


export default function mount(instance, container, method, ...args) {

    const elementFromInstance = createDOMfromRenderedVirtualNode(instance);

    if(isComponent(instance)) {

        instance.onComponentWillMount(elementFromInstance);

    }

    container[method](elementFromInstance, ...args);

    if(isComponent(instance)) {

        instance.onComponentMount(elementFromInstance);

    }

    return elementFromInstance;

}