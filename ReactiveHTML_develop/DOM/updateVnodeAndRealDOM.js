import diff from '../diff/diff.js';
import isObject from '../isObject.js';
import componentClass from '../vnode/component.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 */

export default function updateVnodeAndRealDOM(oldComponent, harmful, nextProps, nextStates, statesTarget, statesKey, statesValue) {

    function assignNewStatesAndProps() {

        // prepare for update states and prop, not update now because of next values of props and states 

        if(nextStates) {

            if(statesTarget) {
    
                statesTarget[statesKey] = statesValue;
    
            } 
    
        }
    
        Object.assign(oldComponent.props, nextProps);

    }

    

    if(harmful === false) {

        // if forcing update is harmful don't trigger componentShouldUpdate, update it without permission


        if(oldComponent.componentShouldUpdate(nextProps, nextStates) === false) {

            // check if component should update (undefined mean everytime update)

            assignNewStatesAndProps(); //patch props and states

            oldComponent.onComponentCancelUpdate();

            return oldComponent;
    
        }  

    }      

    assignNewStatesAndProps(); //patch props and states

    oldComponent.onComponentWillUpdate();

    // if component going to update

    const newVNode = patchComponents(

        oldComponent.Element(
            oldComponent.props, 
            oldComponent.states
        ), 
        oldComponent, 
        harmful

    ); //patch all existing components and add new components in tree

    if(!deepEqual(newVNode, oldComponent)) {

        // if component virtual DOM tree changed

        oldComponent.onComponentTreeChange();

    }
 
    if (oldComponent.realDOM) {

        const patch = diff(oldComponent, newVNode); // get patches
        newVNode.realDOM = patch(oldComponent.realDOM); //patch real DOM of component

    }

    Object.assign(oldComponent, newVNode); // patch old virtual DOM tree

    oldComponent.onComponentUpdate();

    return oldComponent;

}

/**
 * update all components inside updated component
 * @param { updated Component children } rootChildren 
 */

function patchComponents(newChild, oldChild, harmful) {

    if (!isObject(newChild)) return newChild; //if is text node, return it

    if (newChild.type.prototype instanceof componentClass) {

        if(oldChild) {

            //if is component and already exists

            return updateVnodeAndRealDOM(oldChild.__component__, harmful, newChild.props, oldChild.states);

        }

        //if is component and not already exists - render it (trigger its constructor)
        return newChild;

    }

    //if is not component patch components inside

    newChild.children = newChild.children.map( (newInside, i) => patchComponents(newInside, oldChild.children[i], harmful));

    return newChild;
}


function deepEqual(object1, object2) {

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {

        return false;

    }

    for (const key of keys1) {

        const val1 = object1[key];
        const val2 = object2[key];

        const areObjects = isObject(val1) && isObject(val2);

        if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {

            //if values are not objects and are not equal
            //if values are objects create recursion

            return false;

        }

    }

    return true;
}