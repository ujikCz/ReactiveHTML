

/**
 * creates virtual node
 * @param { Component, tagName } type 
 * @param { props, attrs } attrs 
 * @param  { Array of vnodes } children 
 */

import isComponent from "../isComponent.js";

export default function createVnodeElement(type, props = null, ...children) {

    let _key = null;
    if(props !== null && props._key !== undefined) {

        _key = props._key;
        Reflect.deleteProperty(props, '_key');

    }
    
    /**
     * if element is component
     */

    if(isComponent(type)) {
        
        return {
            type,
            props,
            _key
        }

    }


    /**
     * if element is basic virtual node element
     */

    return {
        type,
        attrs: props,
        children,
        _key
    }

}