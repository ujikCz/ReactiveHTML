import isObject from "../../isObject.js";

/**
 * set the new states and props to the old component
 * @param { Function } oldComponent 
 * @param { Object } nextProps 
 * @param { Object } nextStates 
 */

export default function assignNewPropsAndStates(oldComponent, nextProps, nextStates) {

    if(isObject(nextProps)) {

        Object.assign(oldComponent.props, nextProps);

    }

    if(isObject(nextStates)) {


        Object.assign(oldComponent.states, nextStates);

    }

    return oldComponent;

}