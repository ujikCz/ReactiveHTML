

export default function mountLifecycle(component, container) {

    component.onComponentMount(component._internals.realDOM, container);

}