import mount from "../DOM/mount.js";
import render from "../DOM/render.js";


export default function diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject) {

    /*
     *   if both are not a virtual node, it is text node, so replace its value 
     */

    if (!isVOldNodeObject && !isVNewNodeObject) {

        if (vOldNode !== vNewNode) {

            return function (node) {

                node.nodeValue = vNewNode;
                return [vNewNode, node];

            }

        } else {

            return (node) => [vOldNode, node];

        }

    }

    /*
     *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
     */

    return function (node) {

        const newNodeDefinition = render(vNewNode);

        mount(newNodeDefinition, node, 'replaceWith');

        return [newNodeDefinition.virtualNode, newNodeDefinition.realDOM];

    };

}