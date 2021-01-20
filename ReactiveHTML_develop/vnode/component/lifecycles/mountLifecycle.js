

export default function mountLifecycle(component) {

    component.onComponentMount(component.realDOM, component.container);

}