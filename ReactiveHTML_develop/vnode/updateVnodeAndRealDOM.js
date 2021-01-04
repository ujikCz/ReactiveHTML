import diff from '../diff/diff.js';
import isObject from '../isObject.js';
import componentClass from './component.js';
import isArray from '../isArray.js';
import assignNewStatesAndProps from './assignNewStatesAndProps.js';

/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Boolean } harmful - if update is harmful
 * @param { Object } nextProps - next states of props
 * @param { Object } nextStates - next state of states
 */

export default function updateVnodeAndRealDOM(oldComponent, harmful, nextProps, nextStates) {

    if(harmful === false) {

        // if forcing update is harmful don't trigger componentShouldUpdate, update it without permission

        if(oldComponent.componentShouldUpdate(nextProps, nextStates) === false) {

            // check if component should update (undefined mean everytime update)

            assignNewStatesAndProps(oldComponent, nextProps, nextStates, false); //patch props and states

            oldComponent.onComponentCancelUpdate();

            return oldComponent; // return non updated component back to scene
    
        }  

    }      

    const [oldProps, oldStates] = assignNewStatesAndProps(oldComponent, nextProps, nextStates, true); //patch props and states

    oldComponent.onComponentWillUpdate();

    // if component is going to update

    const newVNode = patchComponents(

        oldComponent.Element(
            oldComponent.props, 
            oldComponent.states
        ),
        oldComponent.vnode, 
        harmful

    ); //patch all existing components and add new components in tree
 
    if (oldComponent.realDOM) { // if component is mounted, else patch only its virtual node

        const patch = diff(oldComponent.vnode, newVNode); // get patches
        oldComponent.realDOM = patch(oldComponent.realDOM); //patch real DOM of component

    }
    
    oldComponent.vnode = newVNode; // patch old virtual DOM tree

    oldComponent.onComponentUpdate();

    // if component has getSnapshotAfterUpdate method

    if(oldComponent.getSnapshotAfterUpdate) {

        oldComponent.getSnapshotAfterUpdate(oldProps, oldStates);

    }

    return oldComponent; // updated old component (so newComponent...)

}

/**
 * update all components inside updated component
 * @param { updated Component children } rootChildren 
 */

function patchComponents(newChild, oldChild, harmful) {

    if (!isObject(newChild)) return newChild; //if is text node, return it

    if(isArray(newChild)) {

        return newChild.map( (singleNewChild, i) => patchComponents(singleNewChild, oldChild[i], harmful));

    }

    if (newChild.type.prototype instanceof componentClass) {

        if(oldChild) {

            //if is component and already exists
            return updateVnodeAndRealDOM(oldChild.__component__, harmful, newChild.props, oldChild.states);

        }

        //if is component and not already exists - render it (trigger its constructor)
        return newChild;

    }

    if(oldChild === undefined) {

        return newChild;

    }

    //if is not component patch components inside
    newChild.children = newChild.children.map( (newInside, i) => patchComponents(newInside, oldChild.children[i], harmful));

    return newChild;
}

