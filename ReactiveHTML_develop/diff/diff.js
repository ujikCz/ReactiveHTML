
import isObject from '../isObject.js';
import isComponent from '../isComponent.js';
import mount from '../DOM/mount.js';
import diffComponents from './diffComponents.js';
import render from '../DOM/render.js';
import diffNonObjects from './diffNonObjects.js';
import diffProps from './diffProps.js';
import treeWillUnMount from '../vnode/component/lifecycles/willUnMount/treeWillUnMount.js';

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

            treeWillUnMount(vOldNode.virtualNode);

            node.remove();

            return undefined;

        }

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

        return function (node) {

            const newNodeDefinition = render(vNewNode);

            mount(newNodeDefinition, 
                node.parentNode, 
                () => { 
                    node.replaceWith(newNodeDefinition.realDOM);
                });

            return { ...newNodeDefinition, _key: vNewNode._key };

        }

    }
    
    const propsPatches = diffProps(vOldNode.props, vNewNode.props);

    if(!propsPatches) {

        return null;

    }

    return function (node) {

        vOldNode.props = propsPatches(node);

        return { virtualNode: vOldNode, realDOM: node, _key: vNewNode._key };

    }
};