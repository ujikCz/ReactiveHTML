import updateComponent from '../../update/updateComponent.js';
import isFunction from '../../isFunction.js';
import isObject from '../../isObject.js';

/**
 *  Component class
 */

export default function Component (props) {

    this.props = props || {};

    this.updater = {
        isMounted: false
    };

    this.ref = {
        realDOM: undefined,
        container: undefined
    };

    return this;

}

/**
 * Element method is the only one method that is required to be in component
 */

Component.prototype.Element = function() {

    throw Error(`You have to specify Element method in your Component, if you want to return any element, return ${ undefined }`);

}

/**
 * setState method for set new states of component and update it
 * real dom will react on state changes
 * @param { Object || Function } setter - set the new states of component
 */

Component.prototype.setState = function(setter) {

    if (isFunction(setter)) {

        const nextStates = setter.bind(this)();

        return initUpdate(this, nextStates);

    }

    if(isObject(setter)) {

        return initUpdate(this, setter);

    }

    throw TypeError(`setState method expecting 1 parameter as Function or Object, you give ${ typeof setter }`);

}

/**
 * shouldComponentUpdate is used when component is going to udpate, this method is for better optimalization
 */

Component.prototype.shouldComponentUpdate = function() { return true; };

/**
 * for recognize ReactiveHTML component
 */

Component.prototype.isReactiveHTMLComponent = true;

/**
 * this function will trigger the update of component
 */

function initUpdate(_this, nextStates) {
    
    const patch = updateComponent(_this, _this, nextStates);
    const patched = patch(_this.ref.container);
    _this.ref.container = patched[1];
    _this.virtual = patched[0][0];

    return _this;

}