import diffAttrs from './diffAttrs.js';
import diffChildren from './diffChildren.js';
import isObject from '../isObject.js';
import isComponent from '../isComponent.js';
import mount from '../DOM/mount.js';
import diffComponents from './diffComponents.js';
import render from '../DOM/render.js';
import willUnMount from '../vnode/component/lifecycles/willUnMountLifecycle.js';
import diffNonObjects from './diffNonObjects.js';

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

    if (vNewNode === undefined) {

        return function (node) {

            willUnMount(vOldNode);

            node.remove();

            return [undefined, undefined];

        };

    }

    if(isVOldNodeComponent || isVNewNodeComponent) {

        return diffComponents(vOldNode, vNewNode, isVOldNodeComponent, isVNewNodeComponent);

    }

    if(!isVOldNodeObject || !isVNewNodeObject) {

        return diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject);

    }

    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */

    if (vOldNode.type !== vNewNode.type) {

        return function (node) {

            const newNodeDefinition = render(vNewNode);

            const newRealNode = mount(newNodeDefinition, node, 'replaceWith');

            return [newNodeDefinition.virtualNode, newRealNode];

        };

    }

    return function (node) {

        if(vOldNode._memo) {

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