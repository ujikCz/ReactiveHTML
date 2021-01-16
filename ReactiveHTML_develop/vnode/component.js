import updateComponent from '../update/updateComponent.js';
import isFunction from '../isFunction.js';

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

        if (isFunction(setter)) {

            setter.bind(this)();

            if (this.ref.realDOM) {

                [this.vnode, this.ref.realDOM] = updateComponent(this, this)(this.ref.realDOM);

            } //if setState is called before mount, it can affect only virtual DOM before render

            return this;

        }

        throw TypeError(`setState method expecting 1 parameter as Function, you given ${ typeof setter }`);

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
    getSnapshotBeforeUpdate() {}
    onComponentCancelUpdate() {}

}

Component.ReactiveHTMLComponent = true;