

    /**
     * mount rendered element to page
     * rendered element can be appended or replace the real HTML element
     * @param { Element } renderedVnode - element that is not mounted
     * @param { Element } element - element to mount 
     * @param { Boolean } type - type of DOM manipulation
     */

    export default function mount(renderedVnode, element, type) {

        if (!type) {
            element.appendChild(renderedVnode);
        } else {
            element.replaceWith(renderedVnode);
        }

        return renderedVnode;

    }