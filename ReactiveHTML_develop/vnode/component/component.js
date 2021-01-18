import updateComponent from '../../update/updateComponent.js';
import isFunction from '../../isFunction.js';
import isObject from '../../isObject.js';
import afterUpdateLifecycles from './componentAfterUpdateLifecycles.js';
import assignNewPropsAndStates from './assignNewPropsAndStates.js';
import createDOMfromRenderedVirtualNode from '../../DOM/createDOMfromRenderedVirtualNode.js';

/**
 *  Component class
 */

export default function Component (props) {

    this.props = props || {};

    this.ref = {};

    return this;

}

Component.prototype.Element = function() {

    throw Error(`You have to specify Element method in your Component, if you want to return any element, return ${ undefined }`);

}


Component.prototype.setState = function(setter) {

    function initUpdate(_this, nextStates) {

        if (_this.ref.realDOM) {

            [_this.vnode, _this.ref.realDOM] = updateComponent(_this, _this, nextStates)(_this.ref.realDOM);

            afterUpdateLifecycles(_this);

        } else if(_this.ref.parent) {

            assignNewPropsAndStates(_this, _this, nextStates);

            _this.onComponentWillRender();

            const newVNode = _this.Element();
            const newNode = createDOMfromRenderedVirtualNode(newVNode);

            _this.vnode = newVNode;
            _this.ref.realDOM = newNode;

            _this.onComponentRender(newNode);

            _this.onComponentWillMount(newNode);

            _this.ref.parent.appendChild(newNode);

            _this.onComponentMount(newNode);

            _this.ref.parent = undefined;

        }

        return _this;

    }

    if (isFunction(setter)) {

        const nextStates = setter.bind(this)();

        return initUpdate(this, nextStates);

    }

    if(isObject(setter)) {

        return initUpdate(this, setter);

    }

    throw TypeError(`setState method expecting 1 parameter as Function or Object, you give ${ typeof setter }`);

}

Component.prototype.onComponentUpdate = 
Component.prototype.onComponentWillUpdate = 

Component.prototype.onComponentRender =
Component.prototype.onComponentWillRender =

Component.prototype.onComponentMount =
Component.prototype.onComponentWillMount = 

Component.prototype.onComponentUnMount =
Component.prototype.onComponentWillUnMount = 
        
Component.prototype.onComponentCancelUpdate = function() {}

Component.prototype.shouldComponentUpdate = function() { return true; }

Component.prototype.isReactiveHTMLComponent = true;
