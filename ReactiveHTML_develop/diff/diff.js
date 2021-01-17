import diffAttrs from './diffAttrs.js';
import diffChildren from './diffChildren.js';
import render, { createDOMfromRenderedVirtualNode } from '../DOM/render.js';
import isObject from '../isObject.js';
import updateComponent from '../update/updateComponent.js';
import isFunction from '../isFunction.js';
import createComponentInstance from '../vnode/createComponentInstance.js';
import afterUpdateLifecycles from '../vnode/componentAfterUpdateLifecycles.js';

/**
 * check basic differences between old virtualNode and new one
 * check attributes, events and styles changes
 * apply all these changes to realNode
 * @param { Object } vOldNode - old virtual node tree
 * @param { Object } vNewNode - new virtual node tree
 */

export default function diff(vOldNode, vNewNode) {

    /**
     * cache all statements
     */

    const isVOldNodeObject = isObject(vOldNode);
    const isVNewNodeObject = isObject(vNewNode);
    const isVOldNodeComponent = isVOldNodeObject ? isFunction(vOldNode.type) : false;
    const isVNewNodeComponent = isVNewNodeObject ? isFunction(vNewNode.type) : false;

    /*
     *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
     */


    if (vNewNode === undefined) {

        return function (node) {

            node.remove();

            return [undefined, undefined];

        };

    }

    if(isVOldNodeComponent && isVNewNodeComponent) {

        if(vOldNode.type === vNewNode.type) {

            return function (node) {

                [vOldNode.vnode, node] = updateComponent(vOldNode, vNewNode)(node);

                afterUpdateLifecycles(vOldNode);

                return [vOldNode, node];

            } 

        }

        return function (node) {

            vOldNode.onComponentWillUnMount(vOldNode.ref.realDOM);
            
            const vNewNodeInstance = createComponentInstance(vNewNode);

            [vNewNodeInstance.vnode, node] = diff(vOldNode.vnode, vNewNodeInstance.vnode)(node);

            vNewNodeInstance.onComponentRender(node);

            vNewNodeInstance.onComponentWillMount(node);

            vNewNodeInstance.ref.realDOM = node;
            vOldNode.ref.parent = vOldNode.ref.realDOM.parentNode;
            vOldNode.ref.realDOM = undefined;

            vOldNode.onComponentUnMount();
            vNewNodeInstance.onComponentMount(node);

            return [vNewNodeInstance, node];

        } 

    }

    if(isVOldNodeComponent && !isVNewNodeComponent) {

        return function (node) {

            const patch = diff(vOldNode.vnode, vNewNode);
            
            vOldNode.onComponentWillUnMount(vOldNode.ref.realDOM);

            [vNewNode, node] = patch(node);

            vOldNode.ref.parent = vOldNode.ref.realDOM.parentNode;
            vOldNode.ref.realDOM = undefined;

            vOldNode.onComponentUnMount();

            return [vNewNode, node];

        }

    }

    if(!isVOldNodeComponent && isVNewNodeComponent) {

        return function (node) {

            const vNewNodeInstance = createComponentInstance(vNewNode);

            const patch = diff(vOldNode, vNewNodeInstance.vnode);

            [vNewNode, node] = patch(node);

            vNewNodeInstance.onComponentWillRender();

            vNewNodeInstance.ref.realDOM = node;

            vNewNodeInstance.onComponentRender(node);

            vNewNodeInstance.onComponentWillMount(node);

            vNewNodeInstance.onComponentMount(node);

            return [vNewNode, node];

        }

    }


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

    if ((!isVOldNodeObject && isVNewNodeObject) || (isVOldNodeObject && !isVNewNodeObject)) {

        return function (node) {

            const newVirtualNode = render(vNewNode);
            const newRealNode = createDOMfromRenderedVirtualNode(newVirtualNode);
            node.replaceWith(newRealNode);
            return [newVirtualNode, newRealNode];

        };

    }

    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */

    if (vOldNode.type !== vNewNode.type) {

        return function (node) {

            const newVirtualNode = render(vNewNode);
            const newRealNode = createDOMfromRenderedVirtualNode(newVirtualNode);
            node.replaceWith(newRealNode);
            return [newVirtualNode, newRealNode];

        };
        
    }

    return function (node) {

        if (vOldNode._memo) {

            return [vOldNode, node];

        }

        if (isObject(vOldNode.attrs) || isObject(vNewNode.attrs)) {

            [vNewNode.attrs, node] = diffAttrs(vOldNode.attrs || {}, vNewNode.attrs || {})(node);

        }

        if ((vOldNode.children.length + vNewNode.children.length) > 0) {

            [vNewNode.children, node] = diffChildren(vOldNode.children, vNewNode.children)(node);

        }

        return [vNewNode, node];

    };
};