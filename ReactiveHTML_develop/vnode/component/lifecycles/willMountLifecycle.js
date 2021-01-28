

export default function willMountLifecycle(component, container) {

    component.onComponentWillMount(component._internals.realDOM, container);

}