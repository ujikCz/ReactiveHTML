

export default function renderLifecycle(component) {

    component.onComponentRender(component._internals.realDOM);

}