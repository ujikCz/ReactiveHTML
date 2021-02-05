
import setState from "../setState.js";

export default function willReceiveProps(component, nextProps) {

    component.setState = setter => setState(component, setter, true);

    component.componentWillReceiveProps(nextProps);

    component.setState = setter => setState(component, setter, false);

}