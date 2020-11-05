
(function (w) {

    function defineReactiveHTMLClass() {

        function isString(string) {

            return (typeof string === 'string' || string instanceof String);

        }

        function process(vDOM, classLink) {

            const findInTemplates = classLink.components.find(search => search.name === vDOM.tagName);

            Array.from(vDOM.children).forEach(child => {
                if (!isString(child)) process(child, classLink);
            });

            if (findInTemplates) {

                return Object.assign(vDOM, findInTemplates.template);

            }

            return vDOM;

        }


        function fromElToObject(element) {

            let vDOM = {
                tagName: '',
                attrs: {},
                events: {},
                children: [],
                Append: function (vDOMchilds) {

                    if (isString(vDOMchilds)) {

                        this.children.push(vDOMchilds);

                    } else {

                        vDOMchilds.forEach(vDOMchild => {
                            this.children.push(vDOMchild);
                        });

                    }

                },

                RemoveChild: function (vDOMchild) {

                    const index = this.children.indexOf(vDOMchild);
                    if (index !== -1) {
                        this.children.splice(index, 1);
                    }

                },

                On: function(event, callback) {

                    this.event[event] = callback;

                }
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

                        this.classLink.vDOMs.forEach(virtualElement => {
                            if(virtualElement.realDOM) {
                                const newVNode = this.classLink.Element(virtualElement.stringFunction);
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
                this.vDOMs = [];

            }

            Element(stringFunction) {

                const vTREE = [];

                const string = stringFunction(this.data);

                if (!string.length) return null;

                const temp = document.createElement('template');
                temp.innerHTML = string;

                Array.from(temp.content.childNodes).forEach(fragmentChild => {
                    if (fragmentChild.nodeType === Node.ELEMENT_NODE) {
                        const vDOM = fromElToObject(fragmentChild);

                        process(vDOM, this);

                        this.vDOMs.push({
                            vDOM,
                            stringFunction
                        });

                        vTREE.push(vDOM);
                    } else {

                        vTREE.push(fragmentChild.nodeValue);

                        this.vDOMs.push({
                            vDOM: fragmentChild.nodeValue,
                            stringFunction
                        });

                    }


                });

                if (vTREE.length < 2) return vTREE[0];

                return vTREE;

            }

            Render(vDOM, element) {

                const finded = this.vDOMs.find(f => f.vDOM === vDOM);

                const realDOM = this.Mount(render(vDOM), element);

                finded.realDOM = realDOM;

                return realDOM;

            }

            Mount(templateElement, element) {

                element.replaceWith(templateElement)
                return templateElement;

            }

            Component(name, templateElement) {

                const result = {
                    name,
                    template: templateElement
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

                for(const [k, v] of Object.entries(vDOM.events)) {
                    el.addEventListener(k, v);
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
