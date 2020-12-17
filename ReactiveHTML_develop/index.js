/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

import render from './DOM/render.js';
import mount from './DOM/mount.js';
import checkProto from './vnode/checkProto.js';
import applyLifecycle from './applyLifecycle.js';
import onElementReady from './DOM/elementReady.js';
import createVnodeElement from './vnode/createVnodeElement.js';
import Component from './vnode/component.js';
import Dispatcher from './dispatcher.js';
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

        Component: Component,

        Observable: Observable,

        Dispatcher: Dispatcher,

        render: function (classLink, element, type = false) {

            const rendered = render(checkProto(classLink));

            applyLifecycle(classLink.onComponentRender, classLink, rendered);

            const mounted = mount(
                rendered,
                element,
                type
            );

            applyLifecycle(classLink.onComponentMount, classLink, mounted);

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

        createElement: createVnodeElement

    };

    
    return ReactiveHTML;

}));
