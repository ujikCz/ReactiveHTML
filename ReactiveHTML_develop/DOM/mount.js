import isComponent from "../isComponent.js";
import isObject from "../isObject.js";

/**
 * used to mount element to webpage
 * @param { Object } instance 
 * @param { Element } container 
 * @param { String } method 
 * @param  {...any} args 
 */

export default function mount(newNodeDefinition, container, callback) {

    const virtualNode = newNodeDefinition.virtualNode;

    if (isObject(virtualNode) && isComponent(virtualNode.type)) {

        const componentIntarnals = virtualNode._internals;
        virtualNode.onComponentWillMount(componentIntarnals.realDOM, container);

        callback();

        virtualNode.onComponentMount(componentIntarnals.realDOM, container);

    } else {

        callback();
    }

}