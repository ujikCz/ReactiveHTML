/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import createElement from './vnode/createVnodeElement.js';
import Component from './vnode/component/component.js';
import mount from './DOM/mount.js';
import isComponent from './isComponent.js';
import render from './DOM/render.js';
import rAF from './rAF.js';

/**
 * whole library is in container funciton for use library in node.js, js, as modules, ...
 * @param  { Object } global - window object
 * @param  { Function } factory - ReactiveHTML library
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global = global || self, global.ReactiveHTML = factory());
}(this, function () {

    "use strict";

    const ReactiveHTML = {

        Component,

        render: function(virtualElement, container) {

            rAF(() => {

                if(!container || container.nodeType !== Node.ELEMENT_NODE) {

                    throw TypeError(`render(...) container must be valid Element that is already rendered on page, try to use DOMContentLoaded event on window to wait for all Elements load`);
    
                }

                const newNodeDef = render(virtualElement);
                virtualElement = newNodeDef.virtualNode;
                    
                mount(newNodeDef, container, 'appendChild');

           });

        },

        createElement,

        createFactory: function(component) {

            if(isComponent(component)) {

                throw TypeError(`createFactory(...) expecting first parameter as component Class, you give ${ typeof component }`);

            }

            return function(props = {}, ...children) {

                return createElement(component, props, ...children);

            }

        },

        ref: function() {
            
            return {
                node: null,
                resolved: false
            };  

        }

    };


    return ReactiveHTML;

}));