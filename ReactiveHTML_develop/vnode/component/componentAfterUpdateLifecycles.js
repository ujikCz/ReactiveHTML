

export default function componentAfterUpdateLifecycles(component, snapshot) {

    if(component.vnode === undefined) {

        component.onComponentUnMount();

    } else {

        component.onComponentUpdate(component.ref.realDOM, snapshot);

    }

}