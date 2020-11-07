(function (w) {

    "use strict";

    function defineReactiveHTMLClass() {

        function isString(string) {

            return (typeof string === 'string' || string instanceof String);

        }

        function process(vDOM, classLink) {

            const findInTemplates = classLink.components.find(search => search.name === vDOM.tagName);

            Array.from(vDOM.children).forEach(child => {
                if (!isString(child)) {

                    process(child, classLink);

                }
            });

            if (findInTemplates) {

                return Object.assign(vDOM, fromElToObject(useNativeParser(findInTemplates.virtualDOM(classLink.data))));

            }

            return vDOM;

        }


        function fromElToObject(element, classLink) {

            if(element.nodeValue) return element.nodeValue; // means element is #text

            let vDOM = {
                tagName: '',
                attrs: {},
                children: [],
                events: {}
            };

            vDOM.tagName = element.localName;

            Array.from(element.attributes).forEach(attribute => {
                if(attribute.nodeName.startsWith('on')) {

                    vDOM.events[attribute.nodeName.replace('on', '')] = new Function(`"use strict"; return(${ attribute.nodeValue })`).bind(classLink.data)();

                } else {

                    vDOM.attrs[attribute.nodeName] = attribute.nodeValue;

                }
            });

            Array.from(element.childNodes).forEach(childNode => {
                if (childNode.nodeType === Node.TEXT_NODE) {

                    vDOM.children.push(childNode.nodeValue);

                } else if (childNode.nodeType === Node.ELEMENT_NODE) {

                    vDOM.children.push(fromElToObject(childNode, classLink));

                }
            });

            return vDOM;

        }

        function useNativeParser(string) {

            const nativeParser = new DOMParser();
            const parsed = nativeParser.parseFromString(string, 'text/xml');

            return parsed.documentElement;

        }
 
        const vDOMCache = [];

        class ReactiveHTML {

            constructor(data = {}) {

                const validator = {
                    classLink: this,

                    get(target, key) {

                        /*
                         * observe whole data object no matters how much JSON tree is big
                         */

                        if (typeof target[key] === 'object' && target[key] !== null) {
                            return new Proxy(target[key], validator)
                        } else {
                            return target[key];
                        }
                    },
                    set(target, key, value) {
                        /*
                         * observe value change and update element with new data
                         */
                        target[key] = value;

                        vDOMCache.forEach(virtualElement => {
                            if (virtualElement.realDOM) {

                                const newVNode = fromElToObject(useNativeParser(virtualElement.stringFunction(this.classLink.data)));
                                process(newVNode, this.classLink);
                                const patch = diff(virtualElement.vDOM, newVNode);
                                patch(virtualElement.realDOM);
                                virtualElement.vDOM = newVNode;

                            }
                        });

                        /*
                         * apply changes
                         */

                        return true;
                    }
                };

                this.components = [];
                this.data = new Proxy(data, validator);

            }

            Element(stringFunction) {

                const vDOMString = stringFunction(this.data); 
                const parsedvDOM = useNativeParser(vDOMString);
                const newVDOM = fromElToObject(parsedvDOM, this);
                process(newVDOM, this);

                vDOMCache.push({ vDOM: newVDOM, stringFunction, realDOM: null });

                return newVDOM;

            }

            Render(vDOM, element) {

                const renderedvDOM = render(vDOM);

                const finded = vDOMCache.find(f => f.vDOM === vDOM);

                const realDOM = mount(renderedvDOM, element);
                
                for(const [k, v] of Object.entries(vDOM.events)) {
                    realDOM.addEventListener(k, v);
                }

                finded.realDOM = realDOM;

                return realDOM;

            }

            Component(name, templateElement) {

                const result = {
                    name,
                    virtualDOM: vDOMCache.find(f => f.vDOM === templateElement).stringFunction
                };

                this.components.push(result);

                return result;

            }

        };


        function render(vDOM) {

            if (isString(vDOM)) {
                return document.createTextNode(vDOM);
            }

            return renderElem(vDOM, this);

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


        function mount(templateElement, element) {

            element.replaceWith(templateElement)
            return templateElement;

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
