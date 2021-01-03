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

    function filterAttrs(basic) {

        let events = {};
        let styles = {};
    
        for (const [k, v] of Object.entries(basic)) {
    
            if (k.startsWith('on')) {
    
                events[k.replace('on', '')] = v;
                delete basic[k];
    
            }
    
            if (k === 'style') {
    
                styles = v;
                delete basic[k];
    
            }
        }
    
        return {
    
            basic,
            events,
            styles,
    
        };
    
    }

    function createVnodeElement(type, props, ...children) {

        let _key = null;
        if (props !== null && props[':key'] !== undefined) {

            _key = props[':key'];
            delete props[':key'];

        }

        /**
         * if element is component
         */

        if (type.prototype instanceof Component) {

            return {
                type,
                props,
                _key
            }

        }

        /**
         * if element is basic virtual node element
         */

        return {
            type,
            attrs: props ? filterAttrs(props) : {
                events: {},
                styles: {},
                basic: {}
            },
            children,
            _key
        }

    }

    function getVnodeFromComponent(component) {

        const instance = new component.type(component.props);

        instance.vnode = instance.Element(instance.props, instance.states);
        return instance;

    }

    /**
     * render virtual node (create real node from virtual node)
     * @param { Object } vnode 
     */

    function createDomElement(vnode) {

        const el = document.createElement(vnode.type);

        for (const [k, v] of Object.entries(vnode.attrs.basic)) {
            el.setAttribute(k, v);
        }

        for (const [k, v] of Object.entries(vnode.attrs.events)) {
            el.addEventListener(k, v);
        }

        for (const [k, v] of Object.entries(vnode.attrs.styles)) {
            el.style[k] = v;
        }

        vnode.children.forEach(child => {

            if (Array.isArray(child)) {

                const childGroup = child.map(singleChild => render(singleChild));
                childGroup.forEach(domChild => el.appendChild(domChild));

            } else {

                const childEl = render(child);
                el.appendChild(childEl);

            }

        });

        return el;

    }

    function render(virtualElement) {

        if (!isObject(virtualElement)) {

            return document.createTextNode(virtualElement);

        }

        if (Array.isArray(virtualElement)) {

            return virtualElement.map(singleVirtualElement => render(singleVirtualElement));

        }

        if (virtualElement.type.prototype instanceof Component) {

            const instance = getVnodeFromComponent(virtualElement);
            instance.realDOM = render(instance.vnode);

            instance.onComponentRender(instance.realDOM);

            Object.assign(virtualElement, instance);

            instance.onComponentWillMount(virtualElement.realDOM);

            return virtualElement.realDOM;

        }

        return createDomElement(virtualElement);

    }

    function createProxyInContext(context) {

        return {
            get(target, key, receiver) {

                return target[key];

            },

            set(target, key, value, receiver) {
                
                if (target[key] === value) {

                    return true;

                }

                const nextStates = Object.assign({}, context.states);
                nextStates[key] = value;

                updateVnodeAndRealDOM(context, false, context.props, nextStates, target, key, value);

                return true;
            }
        };

    }

    /**
     *  Component class
     */

    class Component {

        /**
         * constructor of component
         * @param { Object } props 
         */

        constructor(props = {}) {

            this.props = props;

            this.__component__ = this;

            return this;

        }

        /*
         * Element creator method 
         */

        Element() {

            throw Error('You have to specify Element method in your Component');

        }

        /*
         *  basic lifecycles
         */

        onComponentCreate() {}
        onComponentUpdate() {}
        onComponentRender() {}
        onComponentCancelUpdate() {}

        /*
         *  future lifecycles
         */

        onComponentWillUpdate() {}
        onComponentWillRender() {}
        onComponentWillMount() {}

        /*
         *  manage methods
         */

        componentShouldUpdate() {
            return true;
        }

        reactive(object) {

            if (
                isObject(object) &&
                (
                    (object.constructor.name === 'Object') ||
                    Array.isArray(object)
                )
            ) {

                return new Proxy(object, createProxyInContext(this));

            }

            console.warn('To make value reactive, value have to be object or array.');
            return object;

        }


        /**
         * init method
         * @param { Object } props 
         */

        forceComponentUpdate(harmful = false) {

            return updateVnodeAndRealDOM(this, harmful, this.props, this.states);

        }

    }

    function mount(renderedVnode, element, type) {

        if (!type) {
            element.appendChild(renderedVnode);
        } else {
            element.replaceWith(renderedVnode);
        }

        return renderedVnode;

    }

    function updateVnodeAndRealDOM(oldComponent, harmful, nextProps, nextStates, statesTarget, statesKey, statesValue) {

        function assignNewStatesAndProps() {
    
            // prepare for update states and prop, not update now because of next values of props and states 
    
            if(nextStates) {
    
                if(statesTarget) {
        
                    statesTarget[statesKey] = statesValue;
        
                } 
        
            }
            
            if(oldComponent.props) {

                Object.assign(oldComponent.props, nextProps);

            }
    
        }
    
        if(harmful === false) {
    
            // if forcing update is harmful don't trigger componentShouldUpdate, update it without permission
    
    
            if(oldComponent.componentShouldUpdate(nextProps, nextStates) === false) {
    
                // check if component should update (undefined mean everytime update)
    
                assignNewStatesAndProps(); //patch props and states
    
                oldComponent.onComponentCancelUpdate();
    
                return oldComponent;
        
            }  
    
        }      
    
        assignNewStatesAndProps(); //patch props and states
    
        oldComponent.onComponentWillUpdate();
    
        // if component going to update
    
        const newVNode = patchComponents(
    
            oldComponent.Element(
                oldComponent.props, 
                oldComponent.states
            ),
            oldComponent.vnode, 
            harmful
    
        ); //patch all existing components and add new components in tree
     
        if (oldComponent.realDOM) {
    
            const patch = diff(oldComponent.vnode, newVNode); // get patches
            oldComponent.realDOM = patch(oldComponent.realDOM); //patch real DOM of component
    
        }
        
        oldComponent.vnode = newVNode; // patch old virtual DOM tree
    
        oldComponent.onComponentUpdate();
    
        return oldComponent;
    
    }

    function patchComponents(newChild, oldChild, harmful) {
    
        if (!isObject(newChild)) return newChild; //if is text node, return it
    
        if(Array.isArray(newChild)) {
    
            return newChild.map( (singleNewChild, i) => patchComponents(singleNewChild, oldChild[i], harmful));
    
        }
    
        if (newChild.type.prototype instanceof Component) {
    
            if(oldChild) {
    
                //if is component and already exists
                return updateVnodeAndRealDOM(oldChild.__component__, harmful, newChild.props, oldChild.states);
    
            }
    
            //if is component and not already exists - render it (trigger its constructor)
            return newChild;
    
        }
    
        if(oldChild === undefined) {
    
            return newChild;
    
        }
    
        //if is not component patch components inside
        newChild.children = newChild.children.map( (newInside, i) => patchComponents(newInside, oldChild.children[i], harmful));
    
        return newChild;
    }
    
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
    
    function zip(first, second) {

        const zipped = [];
        for (let i = 0; i < Math.min(first.length, second.length); i++) {
            zipped.push([first[i], second[i]]);
        }

        return zipped;

    }

    function diffStyles(oldStyles, newStyles) {

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

    function diffChildren(oldVChildren, newVChildren) {
        const childPatches = [];
        const additionalPatches = [];
    
        oldVChildren.forEach((oldVChild, i) => {
    
            if(Array.isArray(oldVChild)) {
    
                additionalPatches.push(diffArrays(oldVChild, newVChildren[i]));
    
            } else {
    
                childPatches.push(diff(oldVChild, newVChildren[i]));
    
            }
    
        });
    
        /*
         *   if that virtualNode is not in old virtualNode parent, but in new it is, append it
         */
    
    
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

    function diffArrays(oldArray, newArray) {

        const arrayPatches = [];

        oldArray.forEach( (oldNode, i) => {

            if(Array.isArray(oldNode)) {

                return diffArrays(oldNode, newArray[i]);

            }
    
            arrayPatches.push(diff(oldNode, newArray.find(f => f._key === oldNode._key)));

        });
    
        const additionalPatches = [];
    
        for (const additionalVChild of newArray.slice(oldArray.length)) {
    
            additionalPatches.push(function (node) {
                node.appendChild(render(additionalVChild));
                return node;
            });
    
        }
    
        /**
         * apply changes to real dom node
         */
    
        return function (parent) {
    
            for (const [patch, child] of zip(arrayPatches, parent.childNodes)) {
    
                patch(child);
    
            }
    
            for (const additionalPatch of additionalPatches) {
    
                additionalPatch(parent);
    
            }
    
            return parent;
    
        };
    
    }

    function diff(vOldNode, vNewNode) {
        /*
         *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
         */

        
        if(vOldNode.__component__) {

            return node => node;

        }

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

        if (vOldNode.type !== vNewNode.type) {
            return function (node) {
                const newNode = render(vNewNode);
                node.replaceWith(newNode);
                return newNode;
            };
        }

        /*
         *   creates all patch functions from diffing functions 
         */

        const patchAttrs = diffAttrs(vOldNode.attrs.basic, vNewNode.attrs.basic);
        const patchStyles = diffStyles(vOldNode.attrs.styles, vNewNode.attrs.styles);
        const patchChildren = diffChildren(vOldNode.children, vNewNode.children);

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



    const ReactiveHTML = {

        /*
         *   render virtualNode to real element
         *   type can determine if virtualNode will be appended or replaced with this real element 
         */

        Component,

        render: function (component, element) {

            return mount(
                render(component),
                element
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

        createElement: createVnodeElement,

        createFactory: function (component) {

            return function (props = {}) {

                return createVnodeElement(component, props);

            }

        }

    };


    return ReactiveHTML;

}));
