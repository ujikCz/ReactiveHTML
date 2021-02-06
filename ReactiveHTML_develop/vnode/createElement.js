/**
 * creates virtual node
 * @param { Component, String } type 
 * @param { Object } props - attrs/props 
 * @param  { Array of vnodes } children 
 */

import isComponent from "../isComponent.js";

export default function createElement(type, props = null, ...children) {

    props = props || {};

    let _key = null;
    let _ref = null;

    if("_key" in props) {

        _key = props._key.toString();

    }

    if("_ref" in props) {

        _ref = props._ref;

    }

    if(children.length || !isComponent(type)) {

        props = {
            children,
            ...props
        };

    }

    return {
        type,
        props,
        _key,
        _ref
    };

}
