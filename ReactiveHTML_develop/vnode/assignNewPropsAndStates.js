import isObject from "../isObject.js";


export default function assignNewPropsAndStates(oldComponent, nextProps, nextStates) {

    if(isObject(nextProps)) {

        if(oldComponent.props) {

            Object.assign(oldComponent.props, nextProps);

        } else {

            oldComponent.props = nextProps;

        }

    }

    if(isObject(nextStates)) {

        if(oldComponent.states) {

            Object.assign(oldComponent.states, nextStates);

        } else {

            oldComponent.states = nextStates;

        }

    }

    return oldComponent;

}