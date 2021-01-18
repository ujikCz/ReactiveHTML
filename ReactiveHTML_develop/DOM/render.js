import isObject from '../isObject.js';
import isArray from '../isArray.js';
import createComponentInstance from '../vnode/component/createComponentInstance.js';
import isVirtualElement from '../isVirtualElement.js';


/**
 * render the virtualNode 
 * mount rendered element
 * use idle callback
 * @param { Class || Object } virtualElement - class or object that represent virtual dom or component
 */


export default function render(virtualElement) {

    if (isVirtualElement(virtualElement) || !isObject(virtualElement)) {
        //element 
        //OR
        //text node

        return virtualElement;

    }

    if (isArray(virtualElement)) {

        //array
        return virtualElement.map(virtualNode => render(virtualNode));

    }

    //component

    virtualElement = createComponentInstance(virtualElement);

    virtualElement.vnode = render(virtualElement.vnode);

    virtualElement.onComponentWillRender();

    return virtualElement;

}