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

            if (isObject(target[key]) && (target[key].constructor.name === 'Object' || Array.isArray(target[key]))) {

                return new Proxy(target[key], validator);

            } else {

                return target[key];

            }

        },

        set(target, key, value, receiver) {

            target[key] = value;

            updateVnodeAndRealDOM(context);

            return true;
        }
    }
}

/**
 *  Component class
 */

export default class Component {

    constructor(props = {}) {

        this.props = new Proxy(props, createProxyInContext(this));
        
        Object.assign(this, this.Element(this.props));

        this.realDOM = null;
    
        this.onComponentCreate(this.props);
    
        return this;

    }

    Element() {

        throw Error('You have to specify Element method in your Component');

    }

    onComponentCreate() {}
    onComponentUpdate() {}
    onComponentRender() {}
    onComponentMount() {}
    onComponentWillUpdate() {}
    onComponentChange() {}

    static $(props = {}) {

        return createVnodeElement(this, props);

    }

}
