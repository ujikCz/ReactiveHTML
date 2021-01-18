import isObject from '../isObject.js';
import isArray from '../isArray.js';
import createComponentInstance from './component/createComponentInstance.js';
import isComponent from '../isComponent.js';


/**
 * render the virtualNode 
 * mount rendered element
 * use idle callback
 * @param { Class || Object } virtualElement - class or object that represent virtual dom or component
 */


export default function filterVirtualElements(virtualElement) {

    if (isArray(virtualElement)) {

        //array
        return virtualElement.map(virtualNode => filterVirtualElements(virtualNode));

    }

    if (!isObject(virtualElement) || !isComponent(virtualElement.type)) {
        //element 
        //OR
        //text node

        return virtualElement;

    }
    //component

    virtualElement = createComponentInstance(virtualElement);

    virtualElement.vnode = filterVirtualElements(virtualElement.vnode);

    virtualElement.onComponentWillRender();

    return virtualElement;

}