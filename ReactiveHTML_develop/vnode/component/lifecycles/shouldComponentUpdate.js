

export default function shouldComponentUpdateLifecycle(component, nextProps, nextStates) {

    return component.shouldComponentUpdate(nextProps, nextStates);

}