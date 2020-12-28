import diff from '../diff/diff.js';
import isObject from '../isObject.js';
import componentClass, { createProxyInContext } from '../vnode/component.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 */

export default function updateVnodeAndRealDOM(oldComponent, harmful, nextProps, nextStates, statesTarget, statesKey, statesValue) {

    function assignNewStatesAndProps() {

        if(nextStates) {

            if(statesTarget) {
    
                statesTarget[statesKey] = statesValue;
    
            } 
    
        }
    
        Object.assign(oldComponent.props, nextProps);

    }

    

    if(harmful === false) {

        if(oldComponent.componentShouldUpdate(nextProps, nextStates) === false) {

            assignNewStatesAndProps();

            oldComponent.onComponentCancelUpdate();

            return oldComponent;
    
        }  

    }      

    assignNewStatesAndProps();

    oldComponent.onComponentWillUpdate();

    const newVNode = oldComponent.Element(oldComponent.props, oldComponent.states);

    console.log(newVNode, oldComponent)

    newVNode.children = patchComponents(newVNode.children, oldComponent.children, harmful);
    //throw error if children are imideatly components - fix issue

    if (oldComponent.realDOM) {

        const patch = diff(oldComponent, newVNode);
        newVNode.realDOM = patch(oldComponent.realDOM);

    }

    Object.assign(oldComponent, newVNode);

    oldComponent.onComponentUpdate();

    return oldComponent;

}

/**
 * update all components inside updated component
 * @param { updated Component children } rootChildren 
 */

function patchComponents(rootNewChildren, rootOldChildren, harmful) {

    return rootNewChildren.map((child, i) => {

        if (!isObject(child)) return child;

        if (child.type.prototype instanceof componentClass) {

            /*
             *  if component was already initialized
             */

            if (rootOldChildren[i]) {

                /*
                 *  patch existing component, not calling new instance of component
                 */

                return updateVnodeAndRealDOM(rootOldChildren[i].__component__, harmful, child.props, rootOldChildren[i].states);

            }

            /*
             *  if component was not already initialized, return whole component to render and init
             */

            return child;

        } else {

            patchComponents(child.children);
            return child;

        }

    });

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
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }

    return true;
}