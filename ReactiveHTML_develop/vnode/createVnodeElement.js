
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

export default function createVnodeElement(type, attrs, ...children) {

    if(type.prototype instanceof componentClass) {
        
        return {
            type,
            props: attrs || {}
        }

    }

    const filter = filterAttrs(attrs);

    return {
        type,
        attrs: filter.attrs,
        children: flatten(children),
        events: filter.events,
        styles: filter.styles
    }

}