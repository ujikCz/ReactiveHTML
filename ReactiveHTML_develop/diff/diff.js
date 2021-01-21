import diffAttrs from './diffAttrs.js';
import diffChildren from './diffChildren.js';
import filterVirtualElements from '../vnode/filterVirtualElements.js';
import isObject from '../isObject.js';
import isComponent from '../isComponent.js';
import mount from '../DOM/mount.js';
import diffComponents from './diffComponents.js';
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

    const isVOldNodeObject = isObject(vOldNode);
    const isVNewNodeObject = isObject(vNewNode);
    const isVOldNodeComponent = isVOldNodeObject && isComponent(vOldNode.type);
    const isVNewNodeComponent = isVNewNodeObject && isComponent(vNewNode.type);

    /*
     *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
     */

    if(isVOldNodeComponent || isVNewNodeComponent) {

        return diffComponents(vOldNode, vNewNode, isVOldNodeComponent, isVNewNodeComponent);

    }

    if (vNewNode === null) {

        return function (node, parentNode) {

            node.remove();

            return [null, null];

        };

    }

    if (vOldNode === null) {

        return function (node, parentNode) {

            vNewNode = filterVirtualElements(vNewNode);
            const newNode = render(vNewNode, parentNode);

            node = mount(vNewNode, newNode, parentNode, 'appendChild');

            return [vNewNode, node];

        };

    }


    /*
     *   if both are not a virtual node, it is text node, so replace its value 
     */

    if (!isVOldNodeObject && !isVNewNodeObject) {

        if (vOldNode !== vNewNode) {

            return function (node, parentNode) {

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

        return function (node, parentNode) {

            const newVirtualNode = filterVirtualElements(vNewNode);
            const newRealNode = mount(newVirtualNode, node, 'replaceWith');

            return [newVirtualNode, newRealNode];

        };

    }

    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */

    if (vOldNode.type !== vNewNode.type) {

        return function (node, parentNode) {

            const newVirtualNode = filterVirtualElements(vNewNode);

            const newRealNode = mount(newVirtualNode, node, 'replaceWith');

            return [newVirtualNode, newRealNode];

        };

    }

    return function (node, parentNode) {

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