

    import isObject from '../isObject.js';
    import componentClass from '../vnode/component.js';

    /**
     * render the virtualNode 
     * rendered virtualNode is not mounted, but it is now HTML element
     * @param { Object } component - component or vNode object
     */

    export default function render(component) {

        if (!isObject(component)) {

            return document.createTextNode(component);

        }

        if(component.type.prototype instanceof componentClass) {

            const instance = new component.type(component.props);

            instance.onComponentCreate();

            Object.assign(instance, instance.Element(instance.props, instance.states));

            /*
             * assign instane value (vNode, props, ...) to component itself, cause component is only class
             */

            Object.assign(component, instance);

            instance.onComponentWillRender(component.props);

            const rendered = render(instance);
            
            instance.onComponentRender(rendered);

            return rendered;

        }

        const el = document.createElement(component.type);

        for (const [k, v] of Object.entries(component.attrs)) {
            el.setAttribute(k, v);
        }

        for (const [k, v] of Object.entries(component.events)) {
            el.addEventListener(k, v);
        }

        for (const [k, v] of Object.entries(component.styles)) {
            el.style[k] = v;
        }

        component.children.forEach(child => {

            const childEl = render(child);
            el.appendChild(childEl);

        });

        if (component.realDOM === null) {

            component.realDOM = el;

        }


        /*
         *   if it is component, save its real element 
         */

        return el;

    }

    /*
    let nextUnitOfWork = null;​
    function workLoop(deadline) {

        let shouldYield = false;

        while (nextUnitOfWork && !shouldYield) {

            nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
            shouldYield = deadline.timeRemaining() < 1;

        }
        requestIdleCallback(workLoop);
    }​
    requestIdleCallback(workLoop)​;

    function performUnitOfWork(nextUnitOfWork) {
        // TODO
    }*/