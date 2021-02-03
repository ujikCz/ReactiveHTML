
import setState from './setState.js';

/**
 *  Component class
 */

export default function Component(props) {

    this.props = props;
    this.states = {};

    this._internals = {

        realDOM: null,
        virtualNode: null

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

Component.prototype.setState = function(setter) {

    return setState(this, setter, false);

};

Component.prototype.onComponentRender =

    Component.prototype.onComponentWillUpdate =
    Component.prototype.onComponentUpdate =

    Component.prototype.onComponentWillMount =
    Component.prototype.onComponentMount =

    Component.prototype.onComponentCancelUpdate =

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