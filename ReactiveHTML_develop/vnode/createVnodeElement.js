/**
 * creates virtual node
 * @param { Component, String } type 
 * @param { Object } props - attrs/props 
 * @param  { Array of vnodes } children 
 */

import isComponent from "../isComponent.js";

export default function createVnodeElement(type, props = null, ...children) {

    /**
     * get the _key that is originally in props/attributes of virtual element
     */

    if (!type) {

        throw TypeError(`createElement(...) type must be defined, it can be String that represent DOM tagName or Class/Funciton that represent Component`);

    }

    let _key = null;
    let _ref = null;
    if (props !== null) {

        if (props._key !== undefined) {

            _key = props._key.toString();
            delete props._key;

        }

        if (props._ref !== undefined) {

            _ref = props._ref;
            delete props._ref;

        }

    }

    props = props || {};

    /**
     * if element is component
     */


    return new VirtualNode(type, props, children, _key, _ref);

}

function VirtualNode(type, props, children, key, ref) {

    if(isComponent(type)) {

        if(children.length) {

            props = {
                children,
                ...props
            };

        }
        

    } else {

        this.children = children;

    }

    this.props = props;

    this.type = type;

    this._key = key;
    this._ref = ref;

}