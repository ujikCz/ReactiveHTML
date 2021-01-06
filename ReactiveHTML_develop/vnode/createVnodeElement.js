

import filterAttrs from './filterAttrs.js';
import componentClass from './component.js';
import Component from './component.js';


/**
 * creates virtual node
 * @param { Component, tagName } type 
 * @param { props, attrs } attrs 
 * @param  { Array of vnodes } children 
 */

export default function createVnodeElement(type, props = null, ...children) {

    let _key = null;
    if(props !== null && props[':key'] !== undefined) {

        _key = props[':key'];
        delete props[':key'];

    }
    
    /**
     * if element is component
     */

    if(type.prototype instanceof componentClass) {
        
        return {
            type,
            props,
            _key
        }

    }

    if(props !== null) {

        props = filterAttrs(props);

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