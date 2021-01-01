

import filterAttrs from './filterAttrs.js';
import componentClass from './component.js';
import Component from './component.js';


/**
 * creates virtual node
 * @param { Component, tagName } type 
 * @param { props, attrs } attrs 
 * @param  { Array of vnodes } children 
 */

export default function createVnodeElement(type, props, ...children) {

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

    /**
     * if element is basic virtual node element
     */

    return {
        type,
        attrs: props ? filterAttrs(props) : {
            events: {},
            styles: {},
            basic: {}
        },
        children,
        _key
    }

}