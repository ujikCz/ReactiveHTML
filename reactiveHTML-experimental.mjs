(function (w) {

    "use strict";

    function defineReactiveHTMLClass() {

        function isString(string) {

            return (typeof string === 'string' || string instanceof String);

        }

        function parseAllDataTypes(string) {

            if (!Number.isNaN(Number.parseInt(string))) return Number.parseInt(string);

            if (string === 'true' || string === 'false') return JSON.parse(string);

            else return string;

        }

        function fromElToObject(element) {

            if (element.nodeValue) return element.nodeValue; // means element is #text

            let vDOM = {
                tagName: '',
                attrs: {},
                children: [],
            };

            vDOM.tagName = element.localName;

            Array.from(element.attributes).forEach(attribute => {

                vDOM.attrs[attribute.nodeName] = attribute.nodeValue;

            });

            Array.from(element.childNodes).forEach(childNode => {
                if (childNode.nodeType === Node.TEXT_NODE) {

                    vDOM.children.push(childNode.nodeValue);

                } else if (childNode.nodeType === Node.ELEMENT_NODE) {

                    vDOM.children.push(fromElToObject(childNode));

                }
            });

            return vDOM;

        }

        function useNativeParser(string) {

            const nativeParser = new DOMParser();
            const parsed = nativeParser.parseFromString(string, 'text/xml');

            return parsed.documentElement;

        }

        const ReactiveHTML = {

            Component: class {

                constructor(data = {}, componentsInUse = {}) {

                    this.components = componentsInUse;

                    const validator = {
                        classLink: this,

                        get(target, key) {

                            if (typeof target[key] === 'object' && target[key] !== null) {
                                return new Proxy(target[key], validator)
                            } else {
                                return target[key];
                            }

                        },
                        set(target, key, value) {

                            target[key] = value;

                            const oldVnode = this.classLink.virtualDOM;
                            const newVNode = fromElToObject(
                                useNativeParser(this.classLink.__proto__.Element(data))
                            );

                            if (oldVnode !== newVNode) {

                                if(this.classLink.realDOM) {

                                    const patch = diff(oldVnode, newVNode);
                                    this.classLink.realDOM = patch(this.classLink.realDOM);

                                }

                                this.classLink.virtualDOM = newVNode;
                                
                            }

                            return true;
                        }
                    };

                    this.data = new Proxy(data, validator);

                    this.virtualDOM = fromElToObject(
                        useNativeParser(
                            this.__proto__.Element(data)
                        )
                    );

                    convertComponentsIntoDefinition(this.virtualDOM, this.components, this.data);

                    return this;
                }

            },

            Render: function (Vnode, element) {

                const rendered = render(Vnode.virtualDOM);

                const realDOM = mount(
                    rendered,
                    element
                );

                Vnode.realDOM = realDOM;

                return realDOM;

            }

        };


        function mount(renderedVnode, element) {

            element.replaceWith(renderedVnode);
            return renderedVnode;

        }


        function convertAttributesFromComponentToProps(componentVnode, props) {

            Object.entries(componentVnode.attrs).forEach(([k, v]) => {
                props[k] = parseAllDataTypes(v);
            });

            return props;

        }


        function convertComponentsIntoDefinition(vDOMchild, components, props) {

            if (isString(vDOMchild) || (Object.keys(components).length === 0)) return;

            if (vDOMchild.tagName in components) {

                const finded = Object.keys(components).find(f => f === vDOMchild.tagName);

                convertAttributesFromComponentToProps(vDOMchild, components[finded].data);

                return Object.assign(vDOMchild, components[finded].virtualDOM);

            } else {

                vDOMchild.children.forEach(child => {
                    convertComponentsIntoDefinition(child, components, props);
                });

            }

        }




        function render(vDOM) {

            if (isString(vDOM)) {
                return document.createTextNode(vDOM);
            }

            return renderElem(vDOM);

            function renderElem(vDOM) {

                const el = document.createElement(vDOM.tagName);
                for (const [k, v] of Object.entries(vDOM.attrs)) {
                    el.setAttribute(k, v);
                }

                vDOM.children.forEach(child => {
                    const childEl = render(child);
                    el.appendChild(childEl);
                });

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
