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

    /*
     *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
     */

    let changes = false;

    if (vNewNode === undefined) {

        changes = true;

        return [function (node) {

            willUnMount({
                virtualNode: vOldNode
            });

            node.remove();

            return undefined;

        }, changes];

    }

    /**
     * cache all statements
     */

    const isVOldNodeObject = isObject(vOldNode), isVNewNodeObject = isObject(vNewNode);

    if (!isVOldNodeObject || !isVNewNodeObject) {

        return diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject);

    }

    const isVOldNodeComponent = isComponent(vOldNode.type), isVNewNodeComponent = isComponent(vNewNode.type);

    if (isVOldNodeComponent || isVNewNodeComponent) {

        return diffComponents(vOldNode, vNewNode, isVOldNodeComponent, isVNewNodeComponent);

    }



    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */

    if (vOldNode.type !== vNewNode.type) {

        changes = true;

        return [function (node) {

            const newNodeDefinition = render(vNewNode);

            mount(newNodeDefinition, node, 'replaceWith');

            return newNodeDefinition.virtualNode;

        }, changes];

    }

    const attrPatches = diffAttrs(vOldNode.attrs || {}, vNewNode.attrs || {});

    const [childrenPatches, childrenChanges] = diffChildren(vOldNode.children, vNewNode.children);

    if(childrenChanges || attrPatches) {

        changes = true;

    }

    return [function (node) {

        if (attrPatches) {
            vOldNode.attrs = attrPatches(node);
        }

        if(childrenChanges) {

            vOldNode.children = childrenPatches(node);

        }


        return vOldNode;

    }, changes];
};