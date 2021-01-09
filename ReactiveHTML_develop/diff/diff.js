import diffAttrs from './diffAttrs.js';
import diffChildren from './diffChildren.js';
import render from '../DOM/render.js';
import isObject from '../isObject.js';

/**
 * check basic differences between old virtualNode and new one
 * check attributes, events and styles changes
 * apply all these changes to realNode
 * @param { Object } vOldNode - old virtual node tree
 * @param { Object } vNewNode - new virtual node tree
 */

export default function diff(vOldNode, vNewNode) {

    /*
     * if it is component, return node only, update is pathed already cause updateVnodeAndRealDOM patch all components
     */


    if (isObject(vOldNode) && vOldNode.__component__ && isObject(vNewNode) && vNewNode.__component__) {

        return () => undefined;

    }

    /*
     *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
     */

    if (vNewNode === undefined) {

        return function (node) {
            node.remove();
            return undefined;
        };

    }

    /*
     *   if both are not a virtual node, it is text node, so replace its value 
     */

    if (!isObject(vOldNode) && !isObject(vNewNode)) {

        if (vOldNode !== vNewNode) {

            return function (node) {

                node.nodeValue = vNewNode;

            }

        } else {
            return node => undefined;
        }

    }

    /*
     *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
     */

    if (!isObject(vOldNode) || !isObject(vNewNode)) {

        return function (node) {
            return render(vNewNode, function (newNode) {

                node.replaceWith(newNode);

            });
        };

    }

    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */

    if (vOldNode.type !== vNewNode.type) {
        return function (node) {
            return render(vNewNode, function (newNode) {

                node.replaceWith(newNode);

            });
        };
    }

    return function (node) {

        if (vOldNode.attrs !== null) {

            diffAttrs(vOldNode.attrs, vNewNode.attrs)(node);

        }

        if ((vOldNode.children.length + vNewNode.children.length) !== 0) {

            diffChildren(vOldNode.children, vNewNode.children)(node);

        }

        return node;

    };
};