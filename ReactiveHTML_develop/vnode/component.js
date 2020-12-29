import updateVnodeAndRealDOM from '../DOM/updateVnodeAndRealDOM.js';
import isObject from '../isObject.js';
import createVnodeElement from './createVnodeElement.js';

/**
 * creates proxy object for component
 * @param { Class } context - Component context
 */

export function createProxyInContext(context) {
    const validator = {
        get(target, key, receiver) {

            if (
                isObject(target[key]) && 
                ( 
                    (target[key].constructor.name === 'Object' && target[key].toString() === '[object Object]') ||  
                    Array.isArray(target[key])
                )
            ) {

                return new Proxy(target[key], validator);

            } else {

                return target[key];

            }

        },

        set(target, key, value, receiver) {

            if(target[key] === value) {

                return true;

            }

            const nextStates = Object.assign({}, context.states);
            nextStates[key] = value;

            updateVnodeAndRealDOM(context, false, context.props, nextStates, target, key, value);

            return true;
        }
    };

    return validator;
}

/**
 *  Component class
 */

export default class Component {

    /**
     * constructor of component
     * @param { Object } props 
     */

    constructor(props = {}) {

        this.props = props;

        this.realDOM = null;

        this.__component__ = this;

        return this;

    }

    /*
     * Element creator method 
     */

    Element() {

        throw Error('You have to specify Element method in your Component');

    }

    /*
     *  basic lifecycles
     */

    onComponentCreate() {}
    onComponentUpdate() {}
    onComponentRender() {}
    onComponentMount() {}
    onComponentCancelUpdate() {}
    onComponentTreeChange() {}

    //onComponentChange

    /*
     *  future lifecycles
     */

    onComponentWillUpdate() {}
    onComponentWillRender() {}
    onComponentWillMount() {}

    //onComponentWillChange


    /*
     *  manage methods
     */

    componentShouldUpdate() { return true; }

    states(states = {}) { 

        this.states = new Proxy(states, createProxyInContext(this));
        return this.states;

    }


    /**
     * init method
     * @param { Object } props 
     */

    static init(props = {}) {

        return createVnodeElement(this, props);

    }

    forceComponentUpdate(harmful = false) {

        return updateVnodeAndRealDOM(this, harmful, this.props);

    }

}