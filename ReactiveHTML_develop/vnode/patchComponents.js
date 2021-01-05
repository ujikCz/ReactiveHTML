
import isObject from '../isObject.js';
import componentClass from './component.js';
import isArray from '../isArray.js';
import updateVnodeAndRealDOM from './updateVnodeAndRealDOM.js';

/**
 * update all components inside updated component
 * @param { updated Component children } rootChildren 
 */

export default function patchComponents(newChild, oldChild, harmful) {

    if (!isObject(newChild)) return newChild; //if is text node, return it

    if(isArray(newChild)) {

        return newChild.map( (singleNewChild, i) => patchComponents(singleNewChild, oldChild[i], harmful));

    }
   
    if (newChild.type.prototype instanceof componentClass) {

        if(oldChild.__component__) {

            //if is component and already exists
            return updateVnodeAndRealDOM(oldChild.__component__, harmful, newChild.props, oldChild.states);

        }

        //if is component and not already exists - render it (trigger its constructor)
        return newChild;

    }

    //if oldChild is undefined or newChild is not component but old child is, replace with newChild

    if(oldChild === undefined) {

        return newChild;

    }

    if(oldChild.__component__ && !(newChild.type.prototype instanceof componentClass)) {

        oldChild.__component__.onComponentWillUnMount();

        oldChild.__component__.realDOM = undefined;

        oldChild.__component__.onComponentUnMount();

        return newChild;

    }

    //if is not component patch components inside
    newChild.children = newChild.children.map( (newInside, i) => patchComponents(newInside, oldChild.children[i], harmful));

    return newChild;
}