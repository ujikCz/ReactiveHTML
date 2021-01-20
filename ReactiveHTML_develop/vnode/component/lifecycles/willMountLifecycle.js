

export default function willMountLifecycle(component) {

    component.onComponentWillMount(component.realDOM, component.container);

}