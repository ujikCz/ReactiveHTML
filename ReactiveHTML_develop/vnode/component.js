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
        console.log(this);
        if (isFunction(setter)) {

            setter.bind(this)();
            
            [this.vnode, this.ref.realDOM] = updateComponent(this, this)(this.ref.realDOM);
            
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

    shouldComponentUpdate() { return true; }
    getSnapshotBeforeUpdate() {}
    onComponentCancelUpdate() {}

}

Component.ReactiveHTMLComponent = true;