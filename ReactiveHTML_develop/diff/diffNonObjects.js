import mount from "../DOM/mount.js";
import render from "../DOM/render.js";


export default function diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject) {

    /*
     *   if both are not a virtual node, it is text node, so replace its value 
     */ 

    let changes = false;

     if (!isVOldNodeObject && !isVNewNodeObject) {

        if (vOldNode !== vNewNode) {

            changes = true;

            return [function (node) {

                node.nodeValue = vNewNode;
                return vNewNode;

            }, changes]

        } else {

            return [() => vOldNode, changes];

        }

    }

    /*
     *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
     */
    changes = true;

    return [function (node) {

        const newNodeDefinition = render(vNewNode);

        mount(newNodeDefinition, node, 'replaceWith');

        return newNodeDefinition.virtualNode;

    }, changes];

}