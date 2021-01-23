

export default function mountLifecycle(component, container) {

    component.onComponentMount(component.ref.realDOM, container);

}