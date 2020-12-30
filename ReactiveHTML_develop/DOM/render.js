

    import isObject from '../isObject.js';
    import componentClass from '../vnode/component.js';

    /**
     * render the virtualNode 
     * rendered virtualNode is not mounted, but it is now HTML element
     * @param { Object } component - component or vNode object
     */

    export default render;

    function getVnodeFromComponent(component) {

        const instance = new component.type(component.props);

        instance.vnode = instance.Element(instance.props, instance.states);
        return instance;

    }

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

            if(Array.isArray(child)) {
                
                const childGroup = child.map(singleChild => render(singleChild));
                childGroup.forEach(domChild => el.appendChild(domChild));

            } else {

                const childEl = render(child);
                el.appendChild(childEl);

            }

        });

        return el;

    }

    function render(component) {

        if (!isObject(component)) {

            return document.createTextNode(component);

        }

        if(Array.isArray(component)) {

            return component.map(singleComponent => render(singleComponent));

        }

        if(component.type.prototype instanceof componentClass) {

            const instance = getVnodeFromComponent(component);
            instance.realDOM = render(instance.vnode);
            Object.assign(component, instance);

            return component.realDOM;

        }

        return createDomElement(component);

    }