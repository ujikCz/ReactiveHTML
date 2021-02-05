import isObject from "../../isObject.js";

/**
 * set the new states and props to the old component
 * @param { Function } oldComponent 
 * @param { Object } nextProps 
 * @param { Object } nextStates 
 */

export default function assignNewPropsAndStates(oldComponent, nextProps, nextState) {

    if(isObject(nextProps)) {

        Object.assign(oldComponent.props, nextProps);

    }

    if(isObject(nextState)) {


        Object.assign(oldComponent.state, nextState);

    }

    return oldComponent;

}