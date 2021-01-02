import updateVnodeAndRealDOM from '../DOM/updateVnodeAndRealDOM.js';
import isObject from '../isObject.js';
import createVnodeElement from './createVnodeElement.js';

/**
 * creates proxy object for component
 * @param { Class } context - Component context
 */

export function createProxyInContext(context) {

    return {
        get(target, key, receiver) {

            return target[key];

        },

        set(target, key, value, receiver) {

            if (target[key] === value) {

                return true;

            }

            const nextStates = Object.assign({}, context.states);
            nextStates[key] = value;

            updateVnodeAndRealDOM(context, false, context.props, nextStates, target, key, value);

            return true;
        }
    };

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
    onComponentCancelUpdate() {}

    /*
     *  future lifecycles
     */

    onComponentWillUpdate() {}
    onComponentWillRender() {}
    onComponentWillMount() {}

    /*
     *  manage methods
     */

    componentShouldUpdate() {
        return true;
    }

    reactive(object) {

        if (
            isObject(object) &&
            (
                (object.constructor.name === 'Object') ||
                Array.isArray(object)
            )
        ) {

            return new Proxy(object, createProxyInContext(this));

        }

        console.warn('To make value reactive, value have to be object or array.');
        return object;

    }


    /**
     * init method
     * @param { Object } props 
     */

    forceComponentUpdate(harmful = false) {

        return updateVnodeAndRealDOM(this, harmful, this.props, this.states);

    }

}