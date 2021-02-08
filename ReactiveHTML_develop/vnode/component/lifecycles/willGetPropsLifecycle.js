

export default function willGetPropsLifecycle(component, nextProps) {

    return component.componentWillGetProps(nextProps) || null;

}