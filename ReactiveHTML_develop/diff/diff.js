import diffAttrs from './diffAttrs.js';
import diffChildren from './diffChildren.js';
import filterVirtualElements from '../vnode/filterVirtualElements.js';
import isObject from '../isObject.js';
import updateComponent from '../update/updateComponent.js';
import isComponent from '../isComponent.js';
import createComponentInstance from '../vnode/component/createComponentInstance.js';
import mount from '../DOM/mount.js';
import render from '../DOM/render.js';

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

    console.log(vOldNode, vNewNode)

    const isVOldNodeObject = isObject(vOldNode);
    const isVNewNodeObject = isObject(vNewNode);
    const isVOldNodeComponent = isVOldNodeObject && isComponent(vOldNode.type);
    const isVNewNodeComponent = isVNewNodeObject && isComponent(vNewNode.type);

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

                const patch = updateComponent(vOldNode, vNewNode, undefined);
                const patched = patch(vOldNode.ref.container);
                vOldNode.ref.container = patched[1];
                vOldNode.virtual = patched[0][0];
                
                return [vOldNode, node];

            } 

        }

        return function (node) {
            
            const vNewNodeInstance = createComponentInstance(vNewNode);

            [vNewNodeInstance.vnode, node] = diff(vOldNode.vnode, vNewNodeInstance.vnode)(node);

            vNewNodeInstance.ref.realDOM = node;

            vOldNode.ref.realDOM = undefined;
            
            return [vNewNodeInstance, node];

        } 

    }

    if(isVOldNodeComponent && !isVNewNodeComponent) {

        return function (node) {

            const patch = diff(vOldNode.vnode, vNewNode);
            
            [vNewNode, node] = patch(node);

            vOldNode.ref.realDOM = undefined;

            return [vNewNode, node];

        }

    }

    if(!isVOldNodeComponent && isVNewNodeComponent) {

        return function (node) {

            const vNewNodeInstance = createComponentInstance(vNewNode);

            const patch = diff(vOldNode, vNewNodeInstance.vnode);

            [vNewNode, node] = patch(node);

            vNewNodeInstance.ref.realDOM = node;

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

            const newVirtualNode = filterVirtualElements(vNewNode);
            const newRealNode = mount(newVirtualNode, node, 'replaceWith');

            return [newVirtualNode, newRealNode];

        };

    }

    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */

    if (vOldNode.type !== vNewNode.type) {

        return function (node) {

            const newVirtualNode = filterVirtualElements(vNewNode);

            const newRealNode = mount(newVirtualNode, node, 'replaceWith');

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