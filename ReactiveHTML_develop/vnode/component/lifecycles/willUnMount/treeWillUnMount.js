import isArray from "../../../../../update/ReactiveHTML_develop/isArray.js";
import isComponent from "../../../../../update/ReactiveHTML_develop/isComponent.js";
import isObject from "../../../../../update/ReactiveHTML_develop/isObject.js";
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