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

    function isArray(array) {

        return Array.isArray(array);
    
    }

    function cloneObjectWithoutReference(object) {

        if(!isObject(object)) {
    
            return object;
    
        }
    
        const clone = isArray(object) ? [] : {};
    
        for(const k in object) {
    
            clone[k] = cloneObjectWithoutReference(object[k]);
    
        }
    
        return clone;
    
    }

    function getVnodeFromComponent(component) {

        const instance = new component.type(component.props);
    
        instance.vnode = instance.Element(instance.props, instance.states);
        return instance;
    
    }
    
    function createDomElement(vnode) {
    
        const el = document.createElement(vnode.type);
    
        if(vnode.attrs !== null) {
    
            for (const [k, v] of Object.entries(vnode.attrs.basic)) {
                el.setAttribute(k, v);
            }
        
            for (const [k, v] of Object.entries(vnode.attrs.events)) {
                el.addEventListener(k, v);
            }
        
            for (const [k, v] of Object.entries(vnode.attrs.styles)) {
                el.style[k] = v;
            }
    
        }
    
        if(vnode.children.length) {
    
            vnode.children.forEach(child => {
    
                if (isArray(child)) {
        
                    const childGroup = child.map(singleChild => render(singleChild));
                    childGroup.forEach(domChild => el.appendChild(domChild));
        
                } else {
        
                    const childEl = render(child);
                    el.appendChild(childEl);
        
                }
        
            });
    
        }
    
        return el;
    
    }
    
    function render(virtualElement, container) {
    
        if (!isObject(virtualElement)) {
    
            return document.createTextNode(virtualElement);
    
        }
    
        if (isArray(virtualElement)) {
    
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

    function elementReady(selector, callback, disconnect = true) {

        const observer = new MutationObserver((mutations, me) => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.matches(selector)) {
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
    
            if(isArray(oldVChild)) {
    
                additionalPatches.push(diffArrays(oldVChild, newVChildren[i]));
    
            } else {
    
                childPatches.push(diff(oldVChild, newVChildren[i]));
    
            }
    
        });
    
        for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    
            additionalPatches.push(function (node) {
                node.appendChild(render(additionalVChild));
                return node;
            });
    
        }
    
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
    
        for (const oldNode of oldArray) {

            arrayPatches.push(diff(oldNode, newArray.find(f => f._key === oldNode._key)));
    
        }
    
        const additionalPatches = [];
    
        for (const additionalVChild of newArray.slice(oldArray.length)) {
    
            additionalPatches.push(function (node) {
                node.appendChild(render(additionalVChild));
                return node;
            });
    
        }
    
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

        if(isObject(vOldNode) && vOldNode.__component__ && isObject(vNewNode) && vNewNode.__component__) {

            return node => node; 

        }

        if (vNewNode === undefined) {

            return function (node) {
                node.remove();
                return undefined;
            };

        }

        if(!isObject(vOldNode) && !isObject(vNewNode)) {

            if (vOldNode !== vNewNode) {

                return function(node) {

                    node.nodeValue = vNewNode;

                }

            } else {
                return node => undefined;
            }

        }

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

        if (vOldNode.type !== vNewNode.type) {
            return function (node) {
                const newNode = render(vNewNode);
                node.replaceWith(newNode);
                return newNode;
            };
        }

        let patchAttrs, patchStyles, patchChildren;

        if(vOldNode.attrs !== null) {

            if(Object.keys(vOldNode.attrs.basic).length + Object.keys(vNewNode.attrs.basic).length !== 0) {

                patchAttrs = diffAttrs(vOldNode.attrs.basic, vNewNode.attrs.basic);

            }

            if(Object.keys(vOldNode.attrs.styles).length + Object.keys(vNewNode.attrs.styles).length !== 0) {

                patchStyles = diffStyles(vOldNode.attrs.styles, vNewNode.attrs.styles);

            }

        }

        if( (vOldNode.children.length + vNewNode.children.length) !== 0) {

            patchChildren = diffChildren(vOldNode.children, vNewNode.children);

        }

        return function (node) {

            if(patchAttrs) {

                patchAttrs(node);

            }

            if(patchStyles) {

                patchStyles(node);

            }

            if(patchChildren) {

                patchChildren(node);

            }
            
            return node;
        };
    };

    function assignNewStatesAndProps(oldComponent, nextProps, nextStates, willUpdate) {

        let oldProps, oldStates;
    
        if(oldComponent.getSnapshotBeforeUpdate && willUpdate) {
    
            [oldProps, oldStates] = [cloneObjectWithoutReference(oldComponent.props), cloneObjectWithoutReference(oldComponent.states)];
    
        }
    
        if(statesNotUpdatedYet && oldComponent.states && isObject(nextStates)) {
    
            Object.assign(oldComponent.states, nextStates);
    
        }
        
        if(oldComponent.props && isObject(nextProps)) {
    
            Object.assign(oldComponent.props, nextProps);
    
        }
        
        if(oldProps || oldStates) {
    
            oldComponent.getSnapshotBeforeUpdate(oldProps, oldStates);
    
        }
    
        return;
    
    }

    class Component {
    
        constructor(props) {
    
            this.props = props;
    
            this.__component__ = this;
    
            this.onComponentCreate();
    
            return this;
    
        }
    
        Element() {
    
            throw new Error('You have to specify Element method in your Component');
    
        }
    
        onComponentCreate() {}
        onComponentUpdate() {}
        onComponentRender() {}
        onComponentCancelUpdate() {}
        onComponentUnMount() {}
    
        onComponentWillUpdate() {}
        onComponentWillRender() {}
        onComponentWillMount() {}
        onComponentWillUnMount() {}
    
        setState(setterFunction) {
            
            if(typeof setterFunction !== 'function') {

                throw new Error('setState, first parameter must be a function with one parameter that represent the states');

            }

            let nextStates;
    
            if(this.componentShouldUpdate || this.getSnapshotBeforeUpdate) {
    
                nextStates = cloneObjectWithoutReference(this.states);
    
            }
    
            setterFunction(nextStates || this.states);
    
            return updateVnodeAndRealDOM(this, false, this.props, nextStates || this.states, false, nextStates === undefined ? false : true);
    
        }
    
        forceComponentUpdate(harmful = false) {
    
            return updateVnodeAndRealDOM(this, harmful, this.props, this.states);
    
        }
    
    }

    function createElement(type, props = null, ...children) {

        let _key = null;
        if(props !== null && props[':key'] !== undefined) {
    
            _key = props[':key'];
            delete props[':key'];
    
        }
    
        if(type.prototype instanceof Component) {
            
            return {
                type,
                props,
                _key
            }
    
        }
    
        if(props !== null) {
    
            props = filterAttrs(props);
    
        }
    
        return {
            type,
            attrs: props,
            children,
            _key
        }
    
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

    function patchComponents(newChild, oldChild, harmful) {

        if (!isObject(newChild)) return newChild;
    
        if(isArray(newChild)) {
    
            return newChild.map( (singleNewChild, i) => patchComponents(singleNewChild, oldChild[i], harmful));
    
        }
       
        if (newChild.type.prototype instanceof Component) {
    
            if(oldChild.__component__) {
    
                return updateVnodeAndRealDOM(oldChild.__component__, harmful, newChild.props, oldChild.states);
    
            }
    
            return newChild;
    
        }
        
        if(oldChild === undefined) {
    
            return newChild;
    
        }
    
        if(oldChild.__component__ && !(newChild.type.prototype instanceof Component)) {
    
            oldChild.__component__.onComponentWillUnMount(oldChild.__component__.realDOM);
    
            oldChild.__component__.realDOM = undefined;
    
            oldChild.__component__.onComponentUnMount();
    
            return newChild;
    
        }
    
        newChild.children = newChild.children.map( (newInside, i) => patchComponents(newInside, oldChild.children[i], harmful));
    
        return newChild;
    }

    function updateVnodeAndRealDOM(oldComponent, harmful, nextProps, nextStates, propsNotUpdatedYet, statesNotUpdatedYet) {

        if(harmful === false && oldComponent.componentShouldUpdate) {
        
            if(oldComponent.componentShouldUpdate(nextProps, nextStates) === false) {
        
                assignNewStatesAndProps(oldComponent, nextProps, nextStates, false);
    
                oldComponent.onComponentCancelUpdate();
    
                return oldComponent;
        
            }  
    
        }      
    
        if(oldComponent.getSnapshotBeforeUpdate || propsNotUpdatedYet || statesNotUpdatedYet) {
    
            assignNewStatesAndProps(oldComponent, nextProps, nextStates, true);
    
        }
        
        oldComponent.onComponentWillUpdate();
        
        const newVNode = patchComponents(
    
            oldComponent.Element(
                oldComponent.props, 
                oldComponent.states
            ),
            oldComponent.vnode, 
            harmful
    
        ); 
     
        if (oldComponent.realDOM) { 
    
            const patch = diff(oldComponent.vnode, newVNode); 
            oldComponent.realDOM = patch(oldComponent.realDOM); 
    
        }
        
        oldComponent.vnode = newVNode;
    
        oldComponent.onComponentUpdate();
    
        return oldComponent;
    
    }

    const ReactiveHTML = {

        Component,

        render: function (component, element) {
            
            return element.appendChild(
                render(component)
            );
            
        },

        elementReady,

        createElement,

        createFactory: function(component) {

            return function(props = {}) {

                return createElement(component, props);

            }

        }

    };

    return ReactiveHTML;
    
}));