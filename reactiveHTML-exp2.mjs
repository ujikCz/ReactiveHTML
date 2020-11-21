(function (w) {

    "use strict";

    function defineReactiveHTMLClass() {

        function isObject(object) {

            return (typeof object === 'object' && (object !== null || object !== undefined));

        }

        function fromAttrsToEvents(Vnode) {

            if (isObject(Vnode)) {
                for (const [k, v] of Object.entries(Vnode.attrs)) {
                    if (k.startsWith('on')) {
                        Vnode.events[k.replace('on', '')] = v;
                        delete Vnode.attrs[k];
                    }
                }

                Vnode.children = Vnode.children.map(VnodeChild => fromAttrsToEvents(VnodeChild));

            }

            return Vnode;

        }

        function flatChildren(Vnode) {

            if (isObject(Vnode)) {
                Vnode.children = flatten(Vnode.children);
                Vnode.children.forEach(child => flatChildren(child));

            }

            return Vnode;

        }

        function flatten(arr) {
            return arr.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
        }

        const ReactiveHTML = {

            Component: class {

                constructor(props = {}) {

                    //this.__proto__.OnInit(props);

                    const validator = {
                        classLink: this,

                        get(target, key) {

                            if (isObject(target[key])) {
                                return new Proxy(target[key], validator)
                            } else {
                                return target[key];
                            }

                        },
                        set(target, key, value) {

                            target[key] = value;

                            const newVNode = fromAttrsToEvents(
                                flatChildren(
                                    this.classLink.__proto__.Element(this.classLink.props)
                                )
                            );

                            if (this.classLink.Vnode !== newVNode) {

                                if (this.classLink.Vnode.realDOM) {

                                    const patch = diff(this.classLink.Vnode, newVNode);
                                    this.classLink.Vnode.realDOM = patch(this.classLink.Vnode.realDOM);

                                }

                                Object.assign(this.classLink.Vnode, newVNode);

                            }

                            return true;
                        }
                    };

                    this.props = new Proxy(props, validator);

                    this.Vnode = fromAttrsToEvents(
                        flatChildren(
                            this.__proto__.Element(this.props)
                        )
                    );
                    //this.__proto__.OnCreate(this);

                    return this;
                }

            },

            Render: function (classLink, element) {

                const rendered = render(classLink.Vnode);

                return mount(
                    rendered,
                    element
                );

            },

            Ready: function (callback) {

                window.addEventListener('DOMContentLoaded', callback);

            },

            Await: function (selector, callback) {

                const observer = new MutationObserver(function (mutations, me) {
                    for (var i = 0; i < mutations.length; i++) {
                        for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                            // We're iterating through _all_ the elements as the parser parses them,
                            // deciding if they're the one we're looking for.
                            if (mutations[i].addedNodes[j].nodeType === Node.ELEMENT_NODE) {
                                if (mutations[i].addedNodes[j].matches(selector)) {
                                    callback(mutations[i].addedNodes[j]);

                                    // We found our element, we're done:
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

                return {
                    tagName,
                    attrs,
                    children,
                    events: {}
                }

            },

            Use: function (classLink) {

                return classLink.Vnode;

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

                vDOM.children.forEach(child => {
                    const childEl = render(child);
                    el.appendChild(childEl);
                });

                vDOM.realDOM = el;

                return el;

            }

        }


        const zip = (xs, ys) => {
            const zipped = [];
            for (let i = 0; i < Math.max(xs.length, ys.length); i++) {
                zipped.push([xs[i], ys[i]]);
            }
            return zipped;
        };

        const diffAttrs = (oldAttrs, newAttrs) => {
            const patches = [];
            // set new attributes
            for (const [k, v] of Object.entries(newAttrs)) {
                patches.push($node => {
                    $node.setAttribute(k, v);
                    return $node;
                });
            }

            // remove old attributes
            for (const k in oldAttrs) {
                if (!(k in newAttrs)) {
                    patches.push($node => {
                        $node.removeAttribute(k);
                        return $node;
                    });
                }
            }

            return $node => {
                for (const patch of patches) {
                    patch($node);
                }
            };
        };

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

        const diff = (vOldNode, vNewNode) => {
            if (vNewNode === undefined) {
                return $node => {
                    $node.remove();
                    return undefined;
                };
            }

            if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
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

            return $node => {
                patchAttrs($node);
                patchChildren($node);
                return $node;
            };
        };

        return ReactiveHTML;
    }

    if (w.ReactiveHTML === undefined) {
        w.ReactiveHTML = defineReactiveHTMLClass();
    }

})(window);