
/**
 * give component last Goodbye, triggers when component is going to leave the page, 
 * this lifecycle is for turn off all asynchronnous setStates that can causes memory leak
 * because garbage collector don't collect the unused instance
 * @param { any } component (String, Object)
 */

export default function componentWillUnMount(component) {

    component.onComponentWillUnMount(component._internals.realDOM);

    component.setState = function () {

        component.setState = function () {};

        const nameOfComponent = component.constructor.name;

        throw Error(`Remove all asynchronnous functions that causes setState(...) of ${ nameOfComponent } in onComponentWillUnMount, else it causes memory leak`);

    };

}
