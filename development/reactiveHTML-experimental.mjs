/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/


(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ReactiveHTML = factory());
}(this, function() {

    function isObject(object) {

        return (typeof object === 'object' && object !== null);

    }

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

    function flatten(children) {
        return children.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }

    function checkProto(object) {

        if (!isObject(object)) return object;

        let proto = Object.getPrototypeOf(object);
        if (proto) {

            proto = Object.getPrototypeOf(proto);

            if (proto) {

                proto = proto.constructor;

                if (proto.name === 'Component') {
                    object.Vnode.realDOM = null;
                    return object.Vnode;
                }
                return object;
            }
            return object;
        }
        return object;

    }

    function convertClassToVnode(children) {
        return children.map(f => checkProto(f));
    }

    const ReactiveHTML = {

        Component: class {

            constructor(props = {}) {

                const thisProto = Object.getPrototypeOf(this);

                const validator = {
                    classLink: this,

                    get(target, key, receiver) {

                        if (isObject(target[key]) && target[key].constructor.name === 'Object') {

                            return new Proxy(target[key], validator);

                        } else {

                            return target[key];

                        }

                    },

                    set(target, key, value, receiver) {

                        target[key] = value;

                        const newVNode = thisProto.Element(this.classLink.props);

                        if (this.classLink.Vnode.realDOM) {

                            const patch = diff(this.classLink.Vnode, newVNode);
                            newVNode.realDOM = patch(this.classLink.Vnode.realDOM);

                        }

                        Object.assign(this.classLink.Vnode, newVNode);

                        return true;
                    }
                };

                this.props = new Proxy(props, validator);

                this.setValue = function (...assigments) {

                    const newVNode = thisProto.Element(this.props);
                    if (this.Vnode.realDOM) {

                        const patch = diff(this.Vnode, newVNode);
                        newVNode.realDOM = patch(this.Vnode.realDOM);

                    }

                    Object.assign(this.Vnode, newVNode);

                    return;
                }

                this.Vnode = thisProto.Element(this.props);

                return this;
            }

        },

        Render: function (classLink, element) {

            const rendered = render(checkProto(classLink));

            return mount(
                rendered,
                element
            );

        },

        Await: function (selector, callback) {

            const observer = new MutationObserver(function (mutations, me) {
                for (var i = 0; i < mutations.length; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {

                        if (mutations[i].addedNodes[j].nodeType === Node.ELEMENT_NODE) {

                            if (mutations[i].addedNodes[j].matches(selector)) {

                                callback(mutations[i].addedNodes[j]);

                                me.disconnect();

                            };

                        }

                    }
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });

        },

        CreateElement: function (tagName, attrs, ...children) { 

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

    function mount(renderedVnode, element) {

        element.appendChild(renderedVnode);

        return renderedVnode;

    }

    function render(vDOM) {

        if (!isObject(vDOM)) {
            return document.createTextNode(vDOM);
        }

        return renderElem(vDOM);

        function renderElem(vDOM) {

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

            if(vDOM.realDOM === null) vDOM.realDOM = el;

            return el;

        }

    }


    function zip(first, second) {

        const zipped = [];
        for (let i = 0; i < Math.min(first.length, second.length); i++) {
            zipped.push([first[i], second[i]]);
        }

        return zipped;

    }

    function diffAttrs(oldAttrs, newAttrs) {

        const attrsPatches = [];

        for (const [k, v] of Object.entries(newAttrs)) {
            if (v !== oldAttrs[k]) {
                attrsPatches.push(
                    function (node) {
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

    const diffChildren = (oldVChildren, newVChildren) => {
        const childPatches = [];
        oldVChildren.forEach((oldVChild, i) => {
            childPatches.push(diff(oldVChild, newVChildren[i]));
        });

        const additionalPatches = [];
        for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
            additionalPatches.push($node => {
                $node.appendChild(render(additionalVChild));
                return $node;
            });
        }

        return $parent => {
            for (const [patch, child] of zip(childPatches, $parent.childNodes)) {
                patch(child);
            }

            for (const patch of additionalPatches) {
                patch($parent);
            }

            return $parent;
        };
    };

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

    const diff = (vOldNode, vNewNode) => {

        if (vNewNode === undefined) {
            return $node => {
                $node.remove();
                return undefined;
            };
        }

        if (!isObject(vOldNode) || !isObject(vNewNode)) {
            if (vOldNode !== vNewNode) {
                return $node => {
                    const $newNode = render(vNewNode);
                    $node.replaceWith($newNode);
                    return $newNode;
                };
            } else {
                return $node => undefined;
            }
        }

        if (vOldNode.tagName !== vNewNode.tagName) {
            return $node => {
                const $newNode = render(vNewNode);
                $node.replaceWith($newNode);
                return $newNode;
            };
        }

        const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
        const patchChildren = diffChildren(vOldNode.children, vNewNode.children);
        const patchStyles = diffStyles(vOldNode.styles, vNewNode.styles);

        return $node => {
            patchAttrs($node);
            patchChildren($node);
            patchStyles($node);
            return $node;
        };
    };

    return ReactiveHTML;

}));
