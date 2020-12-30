
/*
 *  creates virtual node 
 */

import flatten from './flatten.js';
import filterAttrs from './filterAttrs.js';
import componentClass from './component.js';
import Component from './component.js';


/**
 * 
 * @param { Component, tagName } type 
 * @param { props, attrs } attrs 
 * @param  { Array of vnodes } children 
 */

export default function createVnodeElement(type, props, ...children) {

    let _key = null;
    if(props !== null && props[':key']) {

        _key = props[':key'];
        delete props[':key'];

    }
    

    if(type.prototype instanceof componentClass) {
        
        return {
            type,
            props,
            _key
        }

    }

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