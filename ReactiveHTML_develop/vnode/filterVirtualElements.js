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


export default function filterVirtualElements(virtualElement, parentComponent) {

    if (isArray(virtualElement)) {

        //array
        return virtualElement.map(virtualNode => filterVirtualElements(virtualNode, parentComponent));

    }

    if (!isObject(virtualElement)) {

         //text node
        return virtualElement;

    }
    
    if(!isComponent(virtualElement.type)) {

        //element 
        return virtualElement;

    }
    //component

    virtualElement = createComponentInstance(virtualElement);
    virtualElement.ref.parentComponent = parentComponent;
    
    virtualElement.virtual = filterVirtualElements(virtualElement.virtual, virtualElement);

    return virtualElement;

}