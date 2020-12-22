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

            if (target[key] === value) {

                return true;

            }
            
            context.onComponentPropsWillUpdate(context.props);

            target[key] = value;

            updateVnodeAndRealDOM(context);

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

        this.props = this.componentShouldObserveProps() === false ? props : new Proxy(props, createProxyInContext(this));

        Object.assign(this, this.Element(this.props));

        this.realDOM = null;

        this.__component__ = this;

        this.onComponentCreate(this.props);

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

    /*
     *  future lifecycles
     */

    onComponentWillUpdate() {}
    onComponentWillRender() {}
    onComponentWillMount() {}

    /*
     *  props lifecycles
     */

    onComponentPropsUpdate() {}

    /*
     *  future props lifecycles
     */

    onComponentPropsWillUpdate() {}

    /*
     *  manage methods
     */

    componentShouldUpdate() {}
    componentShouldUpdateProps() {}
    componentShouldObserveProps() {}


    /**
     * init method
     * @param { Object } props 
     */

    static init(props = {}) {

        return createVnodeElement(this, props);

    }

}