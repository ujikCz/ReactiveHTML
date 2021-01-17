

export default function afterUpdateLifecycles(component) {

    if(component.vnode === undefined) {

        component.onComponentUnMount();

    } else {

        component.onComponentUpdate();

    }

}