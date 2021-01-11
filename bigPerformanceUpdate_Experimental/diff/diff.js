import diffAttrs from './diffAttrs.js';
import diffChildren from './diffChildren.js';
import render from '../DOM/render.js';
import isObject from '../isObject.js';
import updateComponent from '../update/updateComponent.js';
import triggerLifecycle from '../triggerLifecycle.js';

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

    /*
     *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
     */

    if (vNewNode === undefined) {

        return function (node) {

            node.remove();
            return undefined;

        };

    }

    const isVOldNodeObject = isObject(vOldNode);
    const isVNewNodeObject = isObject(vNewNode);


    if (isVOldNodeObject && vOldNode.__component__) {

        if (typeof vNewNode.type === 'function') {

            return function (node, callback) {

                const patch = updateComponent(vOldNode.__component__, vNewNode);

                patch(node, el => {

                    vOldNode.__component__.realDOM = el;
                    callback(el);

                });

            }

        }

        return function (node, callback) {

            render(vNewNode, function (newNode) {

                triggerLifecycle(vOldNode.__component__.onComponentWillUnMount, vOldNode.__component__, node);

                node.replaceWith(newNode);

                triggerLifecycle(vOldNode.__component__.onComponentUnMount, vOldNode.__component__);

                callback(newNode);

            });

        }

    }

    if (isVNewNodeObject && typeof vNewNode.type === 'function') {

        if(isVOldNodeObject && typeof vOldNode.type === 'function') {

            return () => undefined;

        }

        return function (node) {

            render(vNewNode, function (newNode) {

                node.replaceWith(newNode);

                return newNode;

            });

        }

    }


    /*
     *   if both are not a virtual node, it is text node, so replace its value 
     */

    if (!isVOldNodeObject && !isVNewNodeObject) {

        if (vOldNode !== vNewNode) {

            return function (node) {

                node.nodeValue = vNewNode;

            }

        } else {

            return () => undefined;

        }

    }

    /*
     *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
     */

    if ((!isVOldNodeObject && isVNewNodeObject) || (isVOldNodeObject && !isVNewNodeObject)) {

        return function (node) {
            render(vNewNode, function (newNode) {

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

        if (vOldNode._memo) {

            return node;

        }

        if (vOldNode.attrs !== null && ((Object.keys(vOldNode.attrs).length + Object.keys(vNewNode.attrs).length) > 0)) {

            diffAttrs(vOldNode.attrs, vNewNode.attrs)(node);

        }

        if ((vOldNode.children.length + vNewNode.children.length) > 0) {

            diffChildren(vOldNode.children, vNewNode.children)(node);

        }

        return node;

    };
};