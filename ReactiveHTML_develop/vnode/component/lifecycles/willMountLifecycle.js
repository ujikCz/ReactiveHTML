

export default function willMountLifecycle(component, container) {

    component.onComponentWillMount(component.ref.realDOM, container);

}