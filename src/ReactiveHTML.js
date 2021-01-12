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

    function isFunction(func) {

        return typeof func === 'function';

    }

    function isArray(array) {

        return Array.isArray(array);

    }

    function createElement(type, props = null, ...children) {

        let _key = null;
        if (props !== null && props._key !== undefined) {

            _key = props._key;
            Reflect.deleteProperty(props, '_key');

        }

        /**
         * if element is component
         */

        if (type.ReactiveHTMLComponent) {

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
            attrs: props,
            children,
            _key
        }

    }

    function createComponentInstance(component) {

        const instance = new component.type(component.props);

        instance.vnode = instance.Element(instance.props, instance.states);

        Object.setPrototypeOf(component, Object.getPrototypeOf(instance));

        instance.onComponentWillRender();

        Object.assign(component, instance);

        return component;

    }

    class Component {

        /**
         * constructor of component
         * @param { Object } props 
         */

        constructor(props) {

            this.props = props;

            this.ref = {};

            return this;

        }

        /*
         * Element creator method 
         */

        Element() {

            throw Error('You have to specify Element method in your Component');

        }

        setState(setter) {

            if (isFunction(setter)) {

                setter.bind(this)();

                const patch = updateComponent(this, this);
                return patch(this.ref.realDOM, el => this.ref.realDOM = el);

            }

            throw TypeError(`setState method expecting 1 parameter as Function, you given ${ typeof setter }`);

        }

        onComponentUpdate() {}
        onComponentWillUpdate() {}

        onComponentRender() {}
        onComponentWillRender() {}

        onComponentMount() {}
        onComponentWillMount() {}

        onComponentUnMount() {}
        onComponentWillUnMount() {}

        shouldComponentUpdate() {
            return true;
        }
        getSnapshotBeforeUpdate() {}
        onComponentCancelUpdate() {}

    }

    Component.ReactiveHTMLComponent = true;

    function updateComponent(oldComponent, newComponent) {

        if (oldComponent._memo) {

            return () => undefined;

        }


        if (oldComponent.shouldComponentUpdate() === false) {

            oldComponent.onComponentCancelUpdate();
            return () => undefined;

        }


        oldComponent.getSnapshotBeforeUpdate();

        oldComponent.props = newComponent.props;

        oldComponent.onComponentWillUpdate();

        const newVNode = oldComponent.Element();

        const patch = diff(oldComponent.vnode, newVNode);

        oldComponent.vnode = newVNode;

        oldComponent.onComponentUpdate()

        return patch;

    }

    function updateTreeWithComponent(oldComponent, newComponent) {

        return diff(oldComponent.vnode || oldComponent, newComponent.vnode || newComponent);

    }


    function requestIdle(callback) {

        return callback(); // window.requestAnimationFrame(callback);

    };


    function createDomElement(vnode, callback) {

        if (!isObject(vnode)) {

            return callback(document.createTextNode(vnode));

        }

        if (isArray(vnode)) {

            return callback(vnode.map(singleVirtualElement => render(singleVirtualElement, el => el)));

        }

        const el = document.createElement(vnode.type);

        for (const key in vnode.attrs) {

            if (key.startsWith('on')) {

                el.addEventListener(key.replace('on', ''), vnode.attrs[key]);
                continue;

            } else if (isObject(vnode.attrs[key])) {

                Object.assign(el[key], vnode.attrs[key]);
                continue;

            } else {

                el[key] = vnode.attrs[key];

            }

        }

        if (vnode.children.length) {

            for (let i = 0, ch = vnode.children; i < ch.length; i++) {

                if (isArray(ch[i])) {

                    for (let k = 0; k < ch[i].length; k++) {

                        render(ch[i][k], function (domChild) {

                            el.appendChild(domChild)

                        })

                    }

                } else {

                    render(ch[i], function (childEl) {

                        el.appendChild(childEl);

                    });

                }

            }

        }

        callback(el);

    }

    function render(virtualElement, callback) {


        if (!isObject(virtualElement) || isArray(virtualElement) || !virtualElement.type.ReactiveHTMLComponent) {

            requestIdle(() => createDomElement(virtualElement, callback));

        } else {

            virtualElement = createComponentInstance(virtualElement);

            requestIdle(() => render(virtualElement.vnode, function (el) {

                virtualElement.onComponentRender(el);

                virtualElement.onComponentWillMount(el);
                virtualElement.ref.realDOM = el;

                virtualElement.onComponentMount(el);

                callback(el);

            }));

        }

    }

    function zip(first, second) {

        const zipped = [];
        for (let i = 0; i < Math.min(first.length, second.length); i++) {
            zipped.push([first[i], second[i]]);
        }

        return zipped;

    }

    function diffChildren(oldVChildren, newVChildren) {

        const childPatches = [];
        const additionalPatches = [];
    
        for(let i = 0, l = oldVChildren.length; i < l; i++) {
    
            if(isArray(oldVChildren[i])) {
    
                additionalPatches.push(diffChildren(oldVChildren[i], newVChildren[i]));
    
            } else { 
    
                if(oldVChildren[i]._key !== null) {
                    
                    childPatches.push(diff(oldVChildren[i], newVChildren.find(f => f._key === oldVChildren[i]._key)));
                    
                } else {
    
                    childPatches.push(diff(oldVChildren[i], newVChildren[i]));
    
                }
    
            }
    
        }
    
        for(let i = 0, l = newVChildren.length; i < l; i++) {
    
            if(!isArray(newVChildren[i])) {
    
                if(newVChildren[i]._key !== null) {
    
                    if(!oldVChildren.some(f => f._key === newVChildren[i]._key)) {
    
                        additionalPatches.push(function(node) {
    
                            return render(newVChildren[i], function(newNode) {
                                
                                if(i === (newVChildren.length - 1)) {
    
                                    return node.appendChild(newNode);
    
                                } 
    
                                return node.insertBefore(newNode, node.childNodes[i]);
        
                            });
        
                        });
        
                    }
    
                } else {
    
                    additionalPatches.push(function (node) {
    
                        return render(newVChildren[i], function(newNode) {
    
                            node.appendChild(newNode);
    
                        });
    
                    });
    
                }
    
            } 
    
        }
    
        /*
         *   apply all childNodes changes to parent realNode
         */
    
        return function (parent) {
    
            if(parent) { // check if parent exists cause async operations (fetch, async/await, Promises)
    
                zip(childPatches, parent.childNodes).forEach(([patch, child]) => {
    
                    patch(child);
        
                });
    
            }
    
    
            for(let i = 0; i < additionalPatches.length; i++) {
    
                additionalPatches[i](parent);
    
            }
    
            return parent;
        };
    }

    function diffAttrs(oldAttrs, newAttrs) {

        const attrsPatches = [];
    
        for (const key in newAttrs) {
    
            if (key.startsWith('on')) {
    
                continue;
    
            } else if(isObject(newAttrs[key])) {
                
                attrsPatches.push(function(node) {
    
                    Object.assign(node[key], newAttrs[key]);
                    return node;
    
                });
    
                continue;
    
            } else {
    
                attrsPatches.push(function(node) {
    
                    node[key] = newAttrs[key];
                    return node;
    
                });
                
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
    
            for(let i = 0; i < attrsPatches.length; i++) {
    
                attrsPatches[i](node);
    
            }
    
        };
    
    }

    function diff(vOldNode, vNewNode) {

        /**
         * cache all statements
         */
    
        const isVOldNodeObject = isObject(vOldNode);
        const isVNewNodeObject = isObject(vNewNode);
        const isVOldNodeComponent = isVOldNodeObject ? isFunction(vOldNode.type) : false;
        const isVNewNodeComponent = isVNewNodeObject ? isFunction(vNewNode.type) : false;
    
        /*
         *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
         */
    
        if (vNewNode === undefined) {
    
            return function (node) {
    
                if(isVOldNodeComponent) {
    
                    vOldNode.onComponentWillUnMount();
    
                }
    
                node.remove();
    
                if(isVOldNodeComponent) {
    
                    vOldNode.onComponentUnMount();
    
                }
    
                return undefined;
    
            };
    
        }
    
    
    
        if(isVOldNodeComponent && isVNewNodeComponent) {
    
            if(vOldNode.type === vNewNode.type) {
    
                return function (node, callback) {
    
                    const patch = updateComponent(vOldNode, vNewNode, vOldNode.states);
                    vNewNode.vnode = vOldNode.vnode;
    
                    patch(node, el => callback(el));
    
                } 
    
            }
    
            return function (node, callback) {
    
                render(vNewNode, function(/*newNode*/) {
    
                    vOldNode.onComponentWillUnMount();
    
                    const patch = updateTreeWithComponent(vOldNode, vNewNode);
    
                    patch(node, el => callback(el));
    
                    vOldNode.onComponentUnMount();
    
                }); 
    
            } 
    
        }
    
        if(isVOldNodeComponent && !isVNewNodeComponent) {
    
            return function (node) {
    
                const patch = updateTreeWithComponent(vOldNode, vNewNode);
                
                vOldNode.onComponentWillUnMount();
    
                patch(node);
    
                vOldNode.onComponentUnMount();
    
                return node;
    
            }
    
        }
    
        if(!isVOldNodeComponent && isVNewNodeComponent) {
    
            return function (node, callback) {
    
                render(vNewNode, function (/*newNode*/) {
    
                    const patch = updateTreeWithComponent(vOldNode, vNewNode);
                    
                    patch(node);
    
                    callback(node);
    
                });
    
            }
    
        }
    
    
        /*
         *   if both are not a virtual node, it is text node, so replace its value 
         */
    
        if (!isVOldNodeObject && !isVNewNodeObject) {
    
            if (vOldNode !== vNewNode) {
    
                return function (node) {
    
                    node.nodeValue = vNewNode;
    
                }
    
            } else {
    
                return () => undefined;
    
            }
    
        }
    
        /*
         *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
         */
    
        if ((!isVOldNodeObject && isVNewNodeObject) || (isVOldNodeObject && !isVNewNodeObject)) {
    
            return function (node) {
                render(vNewNode, function (newNode) {
    
                    node.replaceWith(newNode);
    
                });
            };
    
        }
    
        /*
         *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
         */
    
        if (vOldNode.type !== vNewNode.type) {
            return function (node) {
                return render(vNewNode, function (newNode) {
    
                    node.replaceWith(newNode);
    
                });
            };
        }
    
        return function (node) {
    
            if (vOldNode._memo) {
    
                return node;
    
            }
    
            if (vOldNode.attrs !== null && ((Object.keys(vOldNode.attrs).length + Object.keys(vNewNode.attrs).length) > 0)) {
    
                diffAttrs(vOldNode.attrs, vNewNode.attrs)(node);
    
            }
    
            if ((vOldNode.children.length + vNewNode.children.length) > 0) {
    
                diffChildren(vOldNode.children, vNewNode.children)(node);
    
            }
    
            return node;
    
        };
    }

    const ReactiveHTML = {

        Component,

        render: function(element, container) {

            return render(element, function(el){
                
                container.appendChild(el);

                return el;

            });

        },

        /*
         *   creates virtualNode 
         */

        createElement,

        createFactory: function(component) {

            if(!(component.ReactiveHTMLComponent)) {

                throw TypeError('createFactory expecting first parameter as Component class');

            }

            return function(props = {}) {

                return createElement(component, props);

            }

        },

        memo: function(virtualNode) {

            virtualNode._memo = true;
            return virtualNode;

        }

    };


    return ReactiveHTML;

}));