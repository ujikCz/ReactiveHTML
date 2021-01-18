
export default function componentBeforeUpdateLifecycles(component, newVNode, snapshot) {

    if(newVNode === undefined) {

        component.onComponentWillUnMount(component.ref.realDOM);
        component.ref.parent = component.ref.realDOM.parentNode;
    
    } else {

        component.onComponentWillUpdate(snapshot);

    }

}

