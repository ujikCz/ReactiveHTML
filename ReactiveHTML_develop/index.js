/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import createElement from './vnode/createElement.js';
import Component from './vnode/component/component.js';
import mount from './DOM/mount.js';
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

        render: function(virtualElement, container, callback) {

            rAF(() => {

                if(!container || container.nodeType !== Node.ELEMENT_NODE) {

                    throw TypeError(`render(...) container must be valid Element that is already rendered on page, try to use DOMContentLoaded event on window to wait for all Elements load`);
    
                }
                
                const newNodeDefinition = render(virtualElement);

                mount(newNodeDefinition.virtualNode,
                    container,
                    () => {
                        container.appendChild(newNodeDefinition.realDOM);
                    });

                if(callback) {

                    callback();

                }

            });

        },

        createElement

    };


    return ReactiveHTML;

}));