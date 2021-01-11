import diffAttrs from './diffAttrs.js';
import diffChildren from './diffChildren.js';
import render from '../DOM/render.js';
import isObject from '../isObject.js';
import updateComponent from '../update/updateComponent.js';
import triggerLifecycle from '../triggerLifecycle.js';
import isFunction from '../isFunction.js';

/**
 * check basic differences between old virtualNode and new one
 * check attributes, events and styles changes
 * apply all these changes to realNode
 * @param { Object } vOldNode - old virtual node tree
 * @param { Object } vNewNode - new virtual node tree
 */

export default function diff(vOldNode, vNewNode) {


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
    const isVOldNodeComponent = isVOldNodeObject ? isFunction(vOldNode.type) : false;
    const isVNewNodeComponent = isVNewNodeObject ? isFunction(vNewNode.type) : false;

    if(isVOldNodeComponent && isVNewNodeComponent) {

        if(vOldNode.type === vNewNode.type) {

            return function (node, callback) {

                const patch = updateComponent(vOldNode, vNewNode);

                patch(node, el => callback(el));

            } 

        }

        return function (node, callback) {

            render(vNewNode, function (newNode) {

                triggerLifecycle(vOldNode.onComponentWillUnMount, vOldNode, node);

                node.replaceWith(newNode);

                triggerLifecycle(vOldNode.onComponentUnMount, vOldNode);

                callback(newNode);

            });

        } 

    }

    if(isVOldNodeComponent && !isVNewNodeComponent) {

        return function (node, callback) {

            render(vNewNode, function (newNode) {

                triggerLifecycle(vOldNode.onComponentWillUnMount, vOldNode, node);

                node.replaceWith(newNode);

                triggerLifecycle(vOldNode.onComponentUnMount, vOldNode);

                callback(newNode);

            });

        }

    }

    if(!isVOldNodeComponent && isVNewNodeComponent) {

        return function (node, callback) {

            render(vNewNode, function (newNode) {

                node.replaceWith(newNode);

                callback(newNode);

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
