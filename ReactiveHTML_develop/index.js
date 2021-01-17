/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import render, { createDOMfromRenderedVirtualNode } from './DOM/render.js';
import createElement from './vnode/createVnodeElement.js';
import Component from './vnode/component.js';
import memo from './vnode/memo.js';

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

            const elementFromInstance = createDOMfromRenderedVirtualNode(render(virtualElement));

            return container.appendChild(elementFromInstance);

        },

        createElement,

        createFactory: function(component) {

            if(!(component.prototype instanceof Component)) {

                throw Error('createFactory expecting first parameter as component class');

            }

            return function(props = {}) {

                return createElement(component, props);

            }

        },

        memo

    };


    return ReactiveHTML;

}));