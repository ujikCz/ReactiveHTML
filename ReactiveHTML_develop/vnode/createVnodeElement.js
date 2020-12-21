
/*
 *  creates virtual node 
 */

import flatten from './flatten.js';
import filterAttrs from './filterAttrs.js';
import componentClass from './component.js';
import Component from './component.js';
import isObject from '../isObject.js';


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

    children.forEach(child => {

        if(isObject(child) && child.constructor.name === 'Object' && !(child.type.prototype instanceof componentClass)) {

            throw Error('Child of virtual node cannot be object');

        }

    });

    const filter = filterAttrs(attrs);

    return {
        type,
        attrs: filter.attrs,
        children: flatten(children),
        events: filter.events,
        styles: filter.styles
    }

}