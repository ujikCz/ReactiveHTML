import updateComponent from '../update/updateComponent.js';

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

        throw new Error('You have to specify Element method in your Component');

    }

    static ReactiveHTMLComponent = true

    setState(setterFunction) {

        if(typeof setterFunction !== 'function') {

            throw new TypeError('setState expecting function as first parameter');

        }

        /*let nextStates, statesPatches;

        if(this.getSnapshotBeforeUpdate || this.componentShouldUpdate) {

            [nextStates, statesPatches] = createProxy(this.states, [], true);

        } else {

            nextStates = this.states;

        }*/

        setterFunction(this.states);

        const patch = updateComponent(this, this);

        patch(this.ref.realDOM, el => {
            this.ref.realDOM = el;
        });

    }

    forceComponentUpdate(harmful = false) {

        const patch = updateComponent(this, this);

        patch(this.ref.realDOM, el => {
            this.ref.realDOM = el;
        });

    }

}

