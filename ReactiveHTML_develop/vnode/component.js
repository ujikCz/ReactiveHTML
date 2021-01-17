import updateComponent from '../update/updateComponent.js';
import isFunction from '../isFunction.js';
import isObject from '../isObject.js';

/**
 *  Component class
 */

export default class Component {

    /**
     * constructor of component
     * @param { Object } props 
     */

    constructor(props) {

        this.props = props;

        this.ref = {};

        return this;

    }

    /*
     * Element creator method 
     */

    Element() {

        throw Error('You have to specify Element method in your Component');

    }

    setState(setter) {

        function initUpdate(_this, nextStates) {

            if (_this.ref.realDOM) {

                [_this.vnode, _this.ref.realDOM] = updateComponent(_this, _this, nextStates)(_this.ref.realDOM);

            } //if setState is called before mount, it can affect only virtual DOM before render

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


    onComponentUpdate() {}
    onComponentWillUpdate() {}

    onComponentRender() {}
    onComponentWillRender() {}

    onComponentMount() {}
    onComponentWillMount() {}

    onComponentUnMount() {}
    onComponentWillUnMount() {}

    shouldComponentUpdate() {
        return true;
    }
    onComponentCancelUpdate() {}

}

Component.ReactiveHTMLComponent = true;
