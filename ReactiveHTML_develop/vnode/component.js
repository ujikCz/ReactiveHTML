import updateVnodeAndRealDOM from '../update/updateVnodeAndRealDOM.js';
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

        return this;

    }

    /*
     * Element creator method 
     */

    Element() {

        throw new Error('You have to specify Element method in your Component');

    }

    static ReactiveHTMLComponent = true

    setState(setterFunction) {

        if(typeof setterFunction !== 'function') {

            throw new TypeError('setState expecting function as first parameter');

        }

        let nextStates;

        if(this.getSnapshotBeforeUpdate || this.componentShouldUpdate) {

            nextStates = cloneObjectWithoutReference(this.states);

        } else {

            nextStates = this.states;

        }

        setterFunction(nextStates);


        return updateVnodeAndRealDOM(this, false, null, nextStates);

    }

    forceComponentUpdate(harmful = false) {

        return updateVnodeAndRealDOM(this, harmful, null, null);

    }

}

