(function (w) {

    "use strict";

    function defineReactiveHTMLClass() {

        function isObject(object) {

            return (typeof object === 'object' && object !== null);

        }

        function fromAttrsToEvents(attrs, events) {

            for (const [k, v] of Object.entries(attrs)) {
                if (k.startsWith('on')) {
                    events[k.replace('on', '')] = v;
                    delete attrs[k];
                }
            }

            return {
                attrs,
                events
            };

        }

        function flatten(children) {
            return children.reduce(function (flat, toFlatten) {
                return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
            }, []);
        }

        function checkProto(object) {
            
            if(!isObject(object)) return object;

            let proto = Object.getPrototypeOf(object);
            if (proto) {

                proto = Object.getPrototypeOf(proto);

                if (proto) {

                    proto = proto.constructor;

                    if (proto.name === 'Component') {
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

                constructor(props = {}, args = []) {

                    const thisProto = Object.getPrototypeOf(this);
                    const classLink = this;

                    const validator = {
                        classLink: this,

                        get(target, key) {

                            if (isObject(target[key])) {

                                return new Proxy(target[key], validator);

                            } else {

                                return target[key];

                            }

                        },

                        set(target, key, value) {

                            target[key] = value;

                            const newVNode = thisProto.Element(this.classLink.props, classLink.args);

                            if (this.classLink.Vnode.realDOM) {

                                const patch = diff(this.classLink.Vnode, newVNode);
                                newVNode.realDOM = patch(this.classLink.Vnode.realDOM);

                            }

                            Object.assign(this.classLink.Vnode, newVNode);

                            return target;
                        }
                    };

                    this.props = new Proxy(props, validator);
                    this.args = args;

                    this.Vnode = thisProto.Element(this.props, this.args);

                    return this;
                }

            },

            Render: function (classLink, element) {

                if (Array.isArray(classLink)) {

                    classLink.forEach(oneClassLink => {
                        this.Render(oneClassLink, element);
                    });

                } else {

                    const rendered = render(checkProto(classLink));

                    return mount(
                        rendered,
                        element
                    );

                }

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

                const filter = fromAttrsToEvents(attrs, {});

                return {
                    tagName,
                    attrs: filter.attrs,
                    children: convertClassToVnode(flatten(children)),
                    events: filter.events
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

                vDOM.children.forEach(child => {

                    const childEl = render(child);
                    el.appendChild(childEl);

                });

                return vDOM.realDOM = el;

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
