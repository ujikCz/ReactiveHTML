import isComponent from "./isComponent.js";
import warn from "./warn.js";

export default function memo(virtualNode) {

    warn(
        isComponent(virtualNode.type),
        `Memoizing Component will not affect Component from rerender, Component has lifecycle shouldComponentUpdate(nextProps, nextStates), which is used to decide if Component will udpate or not`
    );

    virtualNode._memo = true;
    return virtualNode;

}