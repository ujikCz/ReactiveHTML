/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import createElement from './vnode/createVnodeElement.js';
import Component from './vnode/component/component.js';
import memo from './memo.js';
import mount from './DOM/mount.js';
import isComponent from './isComponent.js';
import render from './DOM/render.js';

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

            virtualElement = render(virtualElement);

            if(virtualElement !== undefined) {

                mount(virtualElement, container, 'appendChild');

            }

        },

        createElement,

        createFactory: function(component) {

            if(isComponent(component)) {

                throw TypeError(`createFactory expecting first parameter as component Class, you give ${ typeof component }`);

            }

            return function(props = {}) {

                return createElement(component, props);

            }

        },

        memo

    };


    return ReactiveHTML;

}));