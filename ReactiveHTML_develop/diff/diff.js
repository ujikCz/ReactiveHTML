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

    if (vNewNode === undefined) {

        return function (node) {

            willUnMount(vOldNode.virtualNode);

            node.remove();

            return undefined;

        }

    }

    /**
     * cache all statements
     */

    const isVOldNodeObject = isObject(vOldNode), isVNewNodeObject = isObject(vNewNode);

    if (!isVOldNodeObject || !isVNewNodeObject) {

        const nonObjectPatches = diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject);

        if(!nonObjectPatches) {

            return null;

        }

        return nonObjectPatches;
    }

    const isVOldNodeComponent = isComponent(vOldNode.type), isVNewNodeComponent = isComponent(vNewNode.type);

    if (isVOldNodeComponent || isVNewNodeComponent) {

        return diffComponents(vOldNode, vNewNode, isVOldNodeComponent, isVNewNodeComponent);

    }



    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */

    if (vOldNode.type !== vNewNode.type) {

        return function (node) {

            const newNodeDefinition = render(vNewNode);

            mount(newNodeDefinition, node, 'replaceWith');

            return newNodeDefinition;

        }

    }
    
    const attrPatches = diffAttrs(vOldNode.props || {}, vNewNode.props || {});

    const childrenPatches = diffChildren(vOldNode.children, vNewNode.children);

    if(!childrenPatches && !attrPatches) {

        return null;

    }

    return function (node) {

        if (attrPatches) {

            vOldNode.props = attrPatches(node);

        }

        if(childrenPatches) {

            vOldNode.children = childrenPatches(node);

        }

        return { virtualNode: vOldNode, realDOM: node };

    }
};