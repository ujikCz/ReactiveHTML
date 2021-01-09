import diff from '../diff/diff.js';
import assignNewStatesAndProps from './assignNewStatesAndProps.js';
import patchComponents from './patchComponents.js';
import triggerLifecycle from '../triggerLifecycle.js';
import createProxy from '../createProxy.js';
/**
 * updates virtualNode and its realNode (update whole component)
 * @param { Class } oldComponent - updated component instance
 * @param { Boolean } harmful - if update is harmful
 * @param { Object } nextProps - next states of props
 * @param { Object } nextStates - next state of states
 */

export default function updateVnodeAndRealDOM(oldComponent, harmful, nextProps, nextStates) {


    if(harmful === false && triggerLifecycle(oldComponent.componentShouldUpdate, oldComponent, nextProps, nextStates) === false) {

        // check if component should update (undefined mean everytime update)

        //assignNewStatesAndProps(oldComponent, nextProps, nextStates, false); //patch props and states

        triggerLifecycle(oldComponent.onComponentCancelUpdate, oldComponent);

        return oldComponent; // return non updated component back to scene

    }  

    /*
     *  if component dont have getSnapshotBeforeUpdate and his props and states are already updated, don't do reduntant function 
     */

    if(oldComponent.getSnapshotBeforeUpdate || nextProps || nextStates) {

        //assignNewStatesAndProps(oldComponent, nextProps, nextStates, true); //patch props and states

    }
    
    triggerLifecycle(oldComponent.onComponentWillUpdate, oldComponent);

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

    triggerLifecycle(oldComponent.onComponentUpdate, oldComponent);

    return oldComponent; // updated old component (so newComponent...)

}



