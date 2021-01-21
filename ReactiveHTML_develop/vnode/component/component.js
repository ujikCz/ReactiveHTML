import updateComponent from '../../update/updateComponent.js';
import isFunction from '../../isFunction.js';
import isObject from '../../isObject.js';
import updateLIfecycle from './lifecycles/updateLifecycle.js';

/**
 *  Component class
 */

function initUpdate(nextComponent, nextStates, node, parentNode) {

    const [patch, snapshot] = updateComponent(this, nextComponent ? nextComponent.props : null, nextStates, parentNode);
    const patched = patch(node);

    this.ref.realDOM = node = patched[1];

    this.ref.virtual = patched[0] || null;

    return [this.ref.virtual, node];

}

export default function Component(props) {

    this.props = props || {};

    this.updater = {
        __update: initUpdate.bind(this),
    };

    this.ref = {
        realDOM: null,
        container: null,
        virtual: null
    };

    return this;

}

/**
 * Element method is the only one method that is required to be in component
 */

Component.prototype.Element = function () {

    throw Error(`You have to specify Element method in your Component, if you want to return any element, return ${ undefined }`);

}

/**
 * setState method for set new states of component and update it
 * real dom will react on state changes
 * @param { Object || Function } setter - set the new states of component
 */

Component.prototype.setState = function (setter) {

    if (isFunction(setter)) {

        const nextStates = setter.bind(this)();


    }

    if (isObject(setter)) {

        const [patch, snapshot] = updateComponent(this, null, setter);
        [this.ref.virtual, this.ref.realDOM] = patch(this.ref.realDOM, this.ref.container);
        return this;

    }

    throw TypeError(`setState method expecting 1 parameter as Function or Object, you give ${ typeof setter }`);

}

Component.prototype.onComponentWillRender =
Component.prototype.onComponentRender =

Component.prototype.onComponentWillUpdate =
Component.prototype.onComponentUpdate =

Component.prototype.onComponentWillMount =
Component.prototype.onComponentMount =

Component.prototype.getSnapshotBeforeUpdate =

Component.prototype.onComponentWillUnMount =
Component.prototype.onComponentUnMount = function () {};

/**
 * shouldComponentUpdate is used when component is going to udpate, this method is for better optimalization
 */

Component.prototype.shouldComponentUpdate = function () {
    return true;
};

/**
 * for recognize ReactiveHTML component
 */

Component.prototype.isReactiveHTMLComponent = true;

/**
 * this function will trigger the update of component
 */

