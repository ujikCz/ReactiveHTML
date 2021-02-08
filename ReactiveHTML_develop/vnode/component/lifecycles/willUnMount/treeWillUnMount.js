import isArray from "../../../../isArray.js";
import isComponent from "../../../../isComponent.js";
import isObject from "../../../../isObject.js";
import componentWillUnMount from "./willUnMountLifecycle.js";



export default function treeWillUnMount(virtualNode) {

    if (isObject(virtualNode)) {

        if (isComponent(virtualNode.type)) {

            componentWillUnMount(virtualNode);

            treeWillUnMount(virtualNode._internals.virtualNode);

        } else {

            const children = isArray(virtualNode) ? virtualNode : virtualNode.props.children;

            for (let i = 0; i < children.length; i++) {

                treeWillUnMount(children[i].virtualNode);

            }

        }

    }

}