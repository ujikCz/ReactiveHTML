
import updateVnodeAndRealDOM from '../DOM/updateVnodeAndRealDOM.js';
import isObject from '../isObject.js';


export default class Component {

    constructor(props = {}) {

        const validator = {
            classLink: this,

            get(target, key, receiver) {

                if (isObject(target[key]) && (target[key].constructor.name === 'Object' || Array.isArray(target[key]))) {

                    return new Proxy(target[key], validator);

                } else {

                    return target[key];

                }

            },

            set(target, key, value, receiver) {

                target[key] = value;

                updateVnodeAndRealDOM(this.classLink);

                return true;
            }
        };

        this.props = new Proxy(props, validator);
        /*
         *   call Element method inside extended class component
         *   that creates virtualNode 
         */

        this.Vnode = this.Element.bind(this)(this.props);

        return this;

    }

    Element() {

        throw Error(`You have to specify Element method in your Component`);

    }

    onComponentInit(){}
    onComponentUpdate(){}
    onComponentRender(){}
    onComponentMount(){}


}