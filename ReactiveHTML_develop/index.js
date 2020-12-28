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
import __observable_change from './observable_change.js';
import updateVnodeAndRealDOM from './DOM/updateVnodeAndRealDOM.js';



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

        Observable: __observable_change,

        render: function (component, element) {

            let type = false;

            const originalType = component.type;
            const rendered = render(component);

            if (component.type === 'ReactiveHTML.Container') {

                type = true;

            }

            if (originalType.prototype instanceof Component) {

                originalType.prototype.onComponentWillMount(originalType.props);

            }

            const mounted = mount(
                rendered,
                element,
                type
            );

            if (originalType.prototype instanceof Component) {

                originalType.prototype.onComponentMount(mounted);

            }

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