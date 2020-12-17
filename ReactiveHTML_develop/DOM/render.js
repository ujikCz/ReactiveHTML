    /*
     *   render the virtualNode 
     *   rendered virtualNode is not mounted, but it is now HTML element
     */

    import isObject from '../isObject.js';

    export default function render(vDOM) {

        if (!isObject(vDOM)) {
            return document.createTextNode(vDOM);
        }

        const el = vDOM.tagName === "" ? document.createDocumentFragment() : document.createElement(vDOM.tagName);

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

        if (vDOM.realDOM === null) {

            if (vDOM.tagName === "") {

                vDOM.realDOM = false;

            } else {

                vDOM.realDOM = el;

            }

        }


        /*
         *   if it is component, save its real element 
         */

        return el;

    }