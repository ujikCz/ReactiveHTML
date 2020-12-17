    /*
     *   mount rendered element to page
     *   rendered element can be appended or replace the real HTML element
     */

    export default function mount(renderedVnode, element, type) {

        if (!type) {
            element.appendChild(renderedVnode);
        } else {
            element.replaceWith(renderedVnode);
        }

        return renderedVnode;

    }