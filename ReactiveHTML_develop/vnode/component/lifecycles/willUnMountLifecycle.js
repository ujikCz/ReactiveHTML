import isComponent from "../../../isComponent.js";
import isObject from "../../../isObject.js";

const alreadyError = [];

export default function willUnMount(component) {

    if (isObject(component)) {

        if (isComponent(component.type)) {

            component.onComponentWillUnMount(component.ref.realDOM, component.ref.container);

            willUnMount(component.ref.virtual);

            component.setState = function() {

                const nameOfComponent = component.constructor.name;
                component.setState = function(){};

                if(!alreadyError.includes(nameOfComponent)) {
                    
                    alreadyError.push(nameOfComponent);
                    throw Error(`Remove all asynchronnous functions that causes set states of ${ nameOfComponent } in onComponentWillUnMount, else it causes memory leak.`);
        
                }

                return;

            };

        } else {

            for (let i = 0; i < component.children.length; i++) {

                willUnMount(component.children[i]);
    
            }

        }

    }

}