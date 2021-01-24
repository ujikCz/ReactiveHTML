import updateComponent from '../../update/updateComponent.js';
import isFunction from '../../isFunction.js';
import isObject from '../../isObject.js';
import warn from '../../warn.js';
import { NON_OBJECT_RETURNED_FROM_SET_STATE } from '../../constants.js';

/**
 *  Component class
 */

export default function Component(props) {

    this.props = props;
    this.states = {};

    this.ref = {
        realDOM: null,
        virtual: null
    };

    return this;

}

/**
 * Element method is the only one method that is required to be in component
 */

Component.prototype.Element = function () {

    //not overrided Element method throws error cause Element must be defined in component
    throw Error(`You have to specify Element method in your Component, Element must return virtual element`);

}

/**
 * setState method for set new states of component and update it
 * real dom will react on state changes
 * @param { Object || Function } setter - set the new states of component
 */

Component.prototype.setState = function (setter) {

    //setter can be object or function that returns object

    if (!this.ref.realDOM) {

        throw Error(`setState(...) can be called only if component is rendered, will be mounted or is mounted`);

    }

    if (isObject(setter) || isFunction(setter)) {

        setter = isFunction(setter) ? setter.bind(this)(this.props, this.states) : setter;
        //get the new states and save them in setter variable

        warn(
            !isObject(setter) || Object.keys(setter).length === 0,
            `setState should be Object or Function that returns Object, if Object is empty or doesn't return nothing, update can be redundant`,
            NON_OBJECT_RETURNED_FROM_SET_STATE
        );

        const [patch, snapshot] = updateComponent(this, null, setter);
        //update component return patch which is function and snapshot that is given from getSnapshotBeforeUpdate

        [this.ref.virtual, this.ref.realDOM] = patch(this.ref.realDOM);
        //patch the virtual dom and the real dom connected to component

        this.onComponentUpdate(snapshot);

        //call update lifecycle in the component

        return this;

    }

    throw TypeError(`setState method expecting 1 parameter as Function or Object, you give ${ typeof setter }`);

}

Component.prototype.onComponentRender =

    Component.prototype.onComponentWillUpdate =
    Component.prototype.onComponentUpdate =

    Component.prototype.onComponentWillMount =
    Component.prototype.onComponentMount =

    Component.prototype.getSnapshotBeforeUpdate =

    Component.prototype.componentWillReceiveProps =

    Component.prototype.onComponentWillUnMount = function () {};

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