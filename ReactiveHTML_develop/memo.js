import isComponent from "./isComponent.js";
import warn from "./warn.js";

export default function memo(virtualNode) {

    if(isComponent(virtualNode.type)) {

        warn(`Memoizing Component will not affect Component from rerender, Component has lifecycle hook shouldComponentUpdate(nextProps, nextStates), which is used to decide if Component will udpate or not`);

    } else {

        virtualNode._memo = true;

    }

    return virtualNode;

}