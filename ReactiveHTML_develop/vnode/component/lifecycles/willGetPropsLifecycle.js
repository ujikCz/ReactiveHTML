
import setState from "../setState.js";

export default function willGetPropsLifecycle(component, nextProps) {

    return component.componentWillGetProps(nextProps) || null;

}