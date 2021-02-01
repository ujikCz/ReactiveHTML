import isComponent from "../../../isComponent.js";
import isObject from "../../../isObject.js";

/**
 * give component last Goodbye, triggers when component is going to leave the page, 
 * this lifecycle is for turn off all asynchronnous setStates that can causes memory leak
 * because garbage collector don't collect the unused instance
 * @param { any } component (String, Object)
 */

export default function willUnMount(component) {

    component = component.virtualNode;

    if (isObject(component)) {

        if (isComponent(component.type)) {

            component.onComponentWillUnMount(component._internals.realDOM);

            component.setState = function() {

                component.setState = function(){};

                const nameOfComponent = component.constructor.name;
                    
                throw Error(`Remove all asynchronnous functions that causes setState(...) of ${ nameOfComponent } in onComponentWillUnMount, else it causes memory leak`);

            };

            willUnMount(component._internals.virtualNode);

        } else {
            
            const children = component.children;

            for (let i = 0; i < children.length; i++) {

                willUnMount(children[i]);
    
            }

        }

    }

}