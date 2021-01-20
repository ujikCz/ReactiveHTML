

export default function renderLifecycle(component) {

    component.onComponentRender(component.ref.realDOM);

}