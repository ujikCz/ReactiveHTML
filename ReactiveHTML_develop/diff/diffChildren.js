import diff from './diff.js';
import isArray from '../isArray.js';
import mount from '../DOM/mount.js';
import render from '../DOM/render.js';
import keyToIndex from './keyToIndex.js';


/**
 * check differences between old virtualNode childNodes and new one
 * apply changes to realNode
 * @param { Array } oldVChildren - old virtual node children
 * @param { Array } newVChildren - new virtual node children
 */


export default function diffChildren(oldVChildren, newVChildren) {

    const updatedVChildren = [];
    const childPatches = [];

    const additionalPatches = [];
    const additionalNewVChildrenIndexes = Object.keys(newVChildren);
    let skipIndexIterator = 0;

    const keyedNew = keyToIndex(newVChildren);


    for (let i = 0; i < oldVChildren.length; i++) {

        const vOldNode = oldVChildren[i];

        if (isArray(vOldNode)) {

            const recursionPatch = diffChildren(vOldNode, newVChildren[i]);

            if (recursionPatch) {

                additionalPatches.push(function(parent) {
                    
                    updatedVChildren[i] = recursionPatch(parent);

                });

            } else {

                updatedVChildren[i] = vOldNode;

            }

            additionalNewVChildrenIndexes.splice(i - skipIndexIterator++, 1);

        } else if (vOldNode.virtualNode._key) {

            const oldVirtualNode = vOldNode.virtualNode;
            const key = oldVirtualNode._key;
            const inNewKeyed = keyedNew[key];         
            
            const childPatch = diff(oldVirtualNode, newVChildren[inNewKeyed]);

            if (childPatch) {

                vOldNode.patch = function (node) {

                    updatedVChildren[inNewKeyed] = childPatch(node);

                };

                childPatches.push(i);

            } else {

                updatedVChildren[inNewKeyed] = vOldNode;

            }

            additionalNewVChildrenIndexes.splice(inNewKeyed - skipIndexIterator++, 1);

        } else {

            const childPatch = diff(vOldNode.virtualNode, newVChildren[i]);

            if (childPatch) {

                vOldNode.patch = function (node) {

                    updatedVChildren[i] = childPatch(node);

                };

                childPatches.push(i);

            } else {

                updatedVChildren[i] = vOldNode;

            }

            additionalNewVChildrenIndexes.splice(i - skipIndexIterator++, 1);

        }

    }

    for (let i = 0; i < additionalNewVChildrenIndexes.length; i++) {

        const indexFromIndexArray = additionalNewVChildrenIndexes[i];
        const newVNode = newVChildren[indexFromIndexArray];

        if (newVNode._key) {

            const indexFromKey = keyedNew[newVNode._key];

            const newNodeDef = render(newVNode);
            updatedVChildren[indexFromKey] = newNodeDef;


            additionalPatches.push(function (parent) {

                mount(newNodeDef, parent, 'insertBefore', parent.childNodes[indexFromKey]);

            });

        } else {

            const newNodeDef = render(newVNode);
            updatedVChildren[indexFromIndexArray] = newNodeDef;

            additionalPatches.push(function (parent) {

                mount(newNodeDef, parent, 'appendChild');

            });

        }

    }


    if (additionalPatches.length + childPatches.length === 0) {

        return null;

    }


    return function (parent) {

        for(let i = 0; i < childPatches.length; i++) {

            const oldVChild = oldVChildren[childPatches[i]];

            oldVChild.patch(oldVChild.realDOM);

        }

        for (let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        return updatedVChildren;

    }

}