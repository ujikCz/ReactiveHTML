/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import render from './DOM/render.js';
import mount from './DOM/mount.js';
import onElementReady from './DOM/elementReady.js';
import createVnodeElement from './vnode/createVnodeElement.js';
import Component from './vnode/component.js';
import Observable from './observable.js';



(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global = global || self, global.ReactiveHTML = factory());
}(this, function () {

    "use strict";


    const ReactiveHTML = {

        /*
         *   render virtualNode to real element
         *   type can determine if virtualNode will be appended or replaced with this real element 
         */

        Component,

        Observable,

        render: function (component, element, type = false) {

            const rendered = render(component);

            //component.onComponentRender(rendered);

            const mounted = mount(
                rendered,
                element,
                type
            );

            //component.onComponentMount(mounted);

            return mounted;

        },

        /*
         *   wait until elements is parsed by HTML parser
         *   then call callback function  
         */

        elementReady: function (selector, callback) {

            onElementReady(selector, callback);

        },

        /*
         *   creates virtualNode 
         */

        createElement: createVnodeElement,

        createFactory: function(component) {

            return function(props = {}) {

                return new component(props);

            }

        }

    };

    
    return ReactiveHTML;

}));
