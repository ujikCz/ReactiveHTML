import updateVnodeAndRealDOM from './updateVnodeAndRealDOM.js';
import deepProxy from './proxy.js';
import cloneObjectWithoutReference from '../cloneObjectWithoutReference.js';

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

        this.__component__ = this;

        this.onComponentCreate();

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
    onComponentCancelUpdate() {}
    onComponentUnMount() {}

    /*
     *  future lifecycles
     */

    onComponentWillUpdate() {}
    onComponentWillRender() {}
    onComponentWillMount() {}
    onComponentWillUnMount() {}

    /*
     *  manage methods
     */

    /*
     * components has these methods too, but they doing some in addition operation so they are checked if exists 
     * getSnapshotBeforeUpdate(oldProps, oldStates) {}
     */

    componentShouldUpdate() {

        return true;

    }

    reactive(object = {}) {

        return deepProxy(object, (manipulation, args, target, prop, value) => {

            let nextStates = Object.assign({}, target);

            if (args === false) {

                manipulation(nextStates, prop, value);
                const nextStateCache = Object.assign({}, this.states);
                nextStates = Object.assign(nextStateCache, nextStates);

            } else {

                nextStates = Object.assign({}, this.states);
                const nextValue = manipulation(...args);
                Object.assign(nextStates, nextValue);

            }

            return updateVnodeAndRealDOM(this, false, this.props, nextStates, target, prop, value);

        });

    }

    setState(setterFunction) {

        const nextStates = cloneObjectWithoutReference(this.states);

        setterFunction(nextStates);

        return updateVnodeAndRealDOM(this, false, this.props, nextStates);

    }

    forceComponentUpdate(harmful = false) {

        return updateVnodeAndRealDOM(this, harmful, this.props, this.states);

    }

}

