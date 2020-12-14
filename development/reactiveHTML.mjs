/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global = global || self, global.ReactiveHTML = factory());
}(this, function () {

    "use strict";

    function isObject(object) {

        return (typeof object === 'object' && object !== null);

    }

    function getProto(object) {

        return Object.getPrototypeOf(object);

    }

    /*
     *   convert attrs object to 3 objects [ attrs, events, styles ] 
     */

    function filterAttrs(attrs) {

        let events = {};
        let styles = {};

        for (const [k, v] of Object.entries(attrs)) {
            if (k.startsWith('on')) {
                events[k.replace('on', '')] = v;
                delete attrs[k];
            }

            if (k === 'style') {
                styles = v;
                delete attrs[k];
            }
        }

        return {
            attrs,
            events,
            styles
        };

    }

    /*
     *   flat array as much as possible
     *   if map method is used on array inside component 
     */

    function flatten(children) {
        return children.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }

    /*
     *   check __proto__ of object, if it is component return its virtualNode else return object 
     */

    function checkProto(object) {

        if (!isObject(object) || !getProto(object) || !getProto(getProto(object))) return object;

        let proto = getProto(getProto(object));

        if (proto.constructor.name === 'Component' && getProto(proto).isPrototypeOf(ReactiveHTML)) {
            object.Vnode.realDOM = null;
            return object.Vnode;
        }

        return object;

    }

    /*
     *   convert children of virtualNode into virtualNodes if components
     */

    function convertClassToVnode(children) {
        return children.map(f => checkProto(f));
    }

    /*
     *   updates virtualNode and its realNode (update whole component)
     */

    function updateVnodeAndRealDOM(classLink) {
        const classLinkProto = getProto(classLink);
        const newVNode = classLinkProto.Element.bind(classLink)(classLink.props, classLink.states);

        if (classLink.Vnode.realDOM) {

            const patch = diff(classLink.Vnode, newVNode);
            newVNode.realDOM = patch(classLink.Vnode.realDOM);

        }

        Object.assign(classLink.Vnode, newVNode);

        applyLifecycle(classLinkProto.onComponentUpdate, classLink);

    }

    /*
     *   whole library is here
     */

    const ReactiveHTML = {

        /*
         *   component class that is ready to extends from it 
         */

        Component: class {

            constructor(props = {}) {

                const thisProto = getProto(this);

                const validator = {
                    classLink: this,

                    get(target, key, receiver) {

                        if (isObject(target[key]) && (target[key].constructor.name === 'Object' || Array.isArray(target[key]))) {

                            return new Proxy(target[key], validator);

                        } else {

                            return target[key];

                        }

                    },

                    set(target, key, value, receiver) {

                        target[key] = value;

                        updateVnodeAndRealDOM(this.classLink);

                        return true;
                    }
                };


                /*
                 *   validator for props and states (Proxy validator)
                 *   detect changes and apply changes into virtualNode and realNode 
                 */


                this.props = new Proxy(props, validator);

                if (thisProto.constructor.__states__ === undefined) {

                    /* 
                     *   save states value 
                     */

                    thisProto.constructor.__states__ = 
                    this.states = new Proxy(thisProto.setStates ? thisProto.setStates.bind(this)(this.props) : {}, validator);

                    applyLifecycle(thisProto.onComponentInit, this);

                } else {

                    this.states = thisProto.constructor.__states__;

                }

                /*
                 *   call Element method inside extended class component
                 *   that creates virtualNode 
                 */

                this.Vnode = thisProto.Element.bind(this)(this.props, this.states);

                applyLifecycle(thisProto.onComponentCreate, this);

                return this;

            }

        },

        /*
         *   observing and templating data
         */

        Observable: class {

            constructor(subscriber) {

                if (typeof subscriber !== 'function') {

                    throw Error(`Observable subscriber must be function, your subscriber has value: ${ subscriber }`);

                }

                this.subscriber = subscriber;
                this.effectArray = new Set();

                return this;

            }

            subscribe(setter) {

                if (typeof setter !== 'function') return this;

                const componentEffectArr = this.effectArray;

                getProto(setter).assign = function (assignNewValue) {

                    this(assignNewValue);

                    componentEffectArr.forEach(component => {

                        updateVnodeAndRealDOM(component);

                    });

                    return this;

                }

                this.subscriber.apply(this, [setter]);

                return this;

            }

            effect(...components) {

                components.forEach(component => {

                    this.effectArray.add(component);

                });

                return this;

            }

        },

        /*
         *   creates dispatcher that is static HTML element
         *   that element change to component immediately 
         */

        Dispatcher: class {

            constructor(elementTagName, component) {

                this.obs = onElementReady(elementTagName, function (el) {

                    const dispatcherProps = {};

                    /*
                     *   convert all HTML element dispatcher attributes to prop (data)  
                     */

                    Array.from(el.attributes).forEach(attributeOfElementDispatcher => {

                        dispatcherProps[attributeOfElementDispatcher.nodeName] = new Function(`"use strict"; return(${ attributeOfElementDispatcher.nodeValue })`)();

                    });

                    return ReactiveHTML.Render(new component(dispatcherProps), el, true);

                }, false, false);

            }

            disconnect() {

                return this.obs.disconnect();

            }

        },

        /*
         *   render virtualNode to real element
         *   type can determine if virtualNode will be appended or replaced with this real element 
         */

        render: function (classLink, element, type = false) {

            const rendered = render(checkProto(classLink));

            const thisProto = getProto(classLink);

            applyLifecycle(thisProto.onComponentRender, classLink);

            applyLifecycle(thisProto.onComponentMount, classLink);

            return mount(
                rendered,
                element,
                type
            );

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

        createElement: function (tagName, attrs = {}, ...children) {

            if (attrs === null) attrs = {};

            const filter = filterAttrs(attrs);

            return {
                tagName,
                attrs: filter.attrs,
                children: convertClassToVnode(flatten(children)),
                events: filter.events,
                styles: filter.styles
            }

        }

    };

    /*
     *   wait until elements is parsed by HTML parser
     *   then call callback function  
     */

    function onElementReady(selector, callback, disconnect = true, mode = true) {

        const observer = new MutationObserver((mutations, me) => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if ((mode && addedNode.matches(selector)) || (addedNode.localName === selector)) {
                            callback(addedNode);
                            if (disconnect) me.disconnect();
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        return observer;

    }

    /*
     *   mount rendered element to page
     *   rendered element can be appended or replace the real HTML element
     */

    function mount(renderedVnode, element, type) {

        if (!type) {
            element.appendChild(renderedVnode);
        } else {
            element.replaceWith(renderedVnode);
        }

        return renderedVnode;

    }

    /*
     *   trigger lifecycle method of component
     *   it can be triggered with additional arguments
     */

    function applyLifecycle(lifecycle, classLink, ...args) {

        if (lifecycle === undefined) return;

        return lifecycle.bind(classLink)(...args);

    }

    /*
     *   render the virtualNode 
     *   rendered virtualNode is not mounted, but it is now HTML element
     */

    function render(vDOM) {

        if (!isObject(vDOM)) {
            return document.createTextNode(vDOM);
        }

        const el = document.createElement(vDOM.tagName);

        for (const [k, v] of Object.entries(vDOM.attrs)) {
            el.setAttribute(k, v);
        }

        for (const [k, v] of Object.entries(vDOM.events)) {
            el.addEventListener(k, v);
        }

        for (const [k, v] of Object.entries(vDOM.styles)) {
            el.style[k] = v;
        }

        vDOM.children.forEach(child => {

            const childEl = render(child);
            el.appendChild(childEl);

        });

        /*
         *   if it is component, save its real element 
         */

        if (vDOM.realDOM === null) vDOM.realDOM = el;

        return el;

    }

    /*
     *   fomate patch and element besides
     *   do it for minimal times (means if patches are smaller than elements, do it only for patches and the same for elements)
     */

    function zip(first, second) {

        const zipped = [];
        for (let i = 0; i < Math.min(first.length, second.length); i++) {
            zipped.push([first[i], second[i]]);
        }

        return zipped;

    }

    /*
     *   check differences between old virtualNode attributes and new one
     *   apply changes to realNode
     */

    function diffAttrs(oldAttrs, newAttrs) {

        const attrsPatches = [];

        for (const [k, v] of Object.entries(newAttrs)) {
            if (v !== oldAttrs[k]) {
                attrsPatches.push(
                    function (node) {
                        if (k === 'value') {
                            node.value = v;
                        }
                        node.setAttribute(k, v);
                        return node;
                    }
                );
            }
        }

        // remove old attributes
        for (const k in oldAttrs) {
            if (!(k in newAttrs)) {
                attrsPatches.push(
                    function (node) {
                        node.removeAttribute(k);
                        return node;
                    }
                );
            }
        }

        return function (node) {
            for (const patchattr of attrsPatches) {
                patchattr(node);
            }
        };

    }

    /*
     *   check differences between old virtualNode childNodes and new one
     *   apply changes to realNode
     */

    const diffChildren = (oldVChildren, newVChildren) => {
        const childPatches = [];
        oldVChildren.forEach((oldVChild, i) => {
            childPatches.push(diff(oldVChild, newVChildren[i]));
        });

        /*
         *   if that virtualNode is not in old virtualNode parent, but in new it is, append it
         */

        const additionalPatches = [];
        for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
            additionalPatches.push(function (node) {
                node.appendChild(render(additionalVChild));
                return node;
            });
        }

        /*
         *   apply all childNodes changes to parent realNode
         */

        return function (parent) {
            for (const [patch, child] of zip(childPatches, parent.childNodes)) {
                patch(child);
            }

            for (const patch of additionalPatches) {
                patch(parent);
            }

            return parent;
        };
    };

    /*
     *   check differences between old virtualNode styles and new one
     *   apply changes to realNode
     */

    const diffStyles = (oldStyles, newStyles) => {

        const stylesPatches = [];

        for (const [k, v] of Object.entries(newStyles)) {
            if (v !== oldStyles[k]) {
                stylesPatches.push(
                    function (node) {
                        node.style[k] = v;
                        return node;
                    }
                );
            }
        }

        // remove old attributes
        for (const k in oldStyles) {
            if (!(k in newStyles)) {
                stylesPatches.push(
                    function (node) {
                        node.style[k] = null;
                        return node;
                    }
                );
            }
        }

        return function (node) {
            for (const patchstyle of stylesPatches) {
                patchstyle(node);
            }
        };

    }

    /*
     *   check basic differences between old virtualNode and new one
     *   check attributes, events and styles changes
     *   apply all these changes to realNode
     */

    const diff = (vOldNode, vNewNode) => {

        /*
         *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
         */

        if (vNewNode === undefined) {
            return function (node) {
                node.remove();
                return undefined;
            };
        }

        /*
         *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
         */

        if (!isObject(vOldNode) || !isObject(vNewNode)) {
            if (vOldNode !== vNewNode) {
                return function (node) {
                    const newNode = render(vNewNode);
                    node.replaceWith(newNode);
                    return newNode;
                };
            } else {
                return node => undefined;
            }
        }

        /*
         *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
         */

        if (vOldNode.tagName !== vNewNode.tagName) {
            return function (node) {
                const newNode = render(vNewNode);
                node.replaceWith(newNode);
                return newNode;
            };
        }

        /*
         *   creates all patch functions from diffing functions 
         */

        const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
        const patchChildren = diffChildren(vOldNode.children, vNewNode.children);
        const patchStyles = diffStyles(vOldNode.styles, vNewNode.styles);

        /*
         *   patch the real element with all patch functions 
         */

        return function (node) {
            patchAttrs(node);
            patchChildren(node);
            patchStyles(node);
            return node;
        };
    };

    return ReactiveHTML;

}));
