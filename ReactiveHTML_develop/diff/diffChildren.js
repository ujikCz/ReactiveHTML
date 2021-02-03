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

function zip(arr1, arr2) {

    const res = [];

    const minLen = Math.min(arr1.length, arr2.length);
    for(let i = 0; i < minLen; i++) {
        
        res.push([
            arr1[i],
            arr2[i]
        ]);

    }

    return res;

}

export default function diffChildren(oldVChildren, newVChildren) {

    const childPatches = [];
    const childPatchesIndexes = [];
    const additionalPatches = [];
    const newVChildrenPatches = Object.keys(newVChildren);
    let skippedPatchesIterator = 0;

    const keyedNew = keyToIndex(newVChildren);

    for (let i = 0; i < oldVChildren.length; i++) {

        const vOldNode = oldVChildren[i];

        if (isArray(vOldNode)) {

            const recursionPatch = diffChildren(vOldNode, newVChildren[i]);

            newVChildrenPatches.splice(i - skippedPatchesIterator++, 1);

            if (recursionPatch) {

                additionalPatches.push(recursionPatch);

            }

        } else if (vOldNode._key) {

            const key = vOldNode._key;
            const inNewKeyed = keyedNew[key];         
            
            newVChildrenPatches.splice(inNewKeyed - skippedPatchesIterator++, 1);

            const childPatch = diff(vOldNode, newVChildren[inNewKeyed]);

            if (childPatch) {

                childPatches.push(function (node) {

                    newVChildren[inNewKeyed] = childPatch(node).virtualNode;

                });

                childPatchesIndexes.push(i);

            } else {

                newVChildren[inNewKeyed] = vOldNode;

            }

        } else {

            const childPatch = diff(vOldNode, newVChildren[i]);

            if (childPatch) {

                childPatches.push(function (node) {

                    newVChildren[i] = childPatch(node).virtualNode;

                });

                childPatchesIndexes.push(i);

            } else {

                newVChildren[i] = vOldNode;

            }

            newVChildrenPatches.splice(i - skippedPatchesIterator++, 1);

        }

    }

    for (let i = 0; i < newVChildrenPatches.length; i++) {

        const newVNode = newVChildren[newVChildrenPatches[i]];

        if (newVNode._key) {

            const indexFromKey = keyedNew[newVNode._key];

            const newNodeDef = render(newVNode);
            newVChildren[indexFromKey] = newNodeDef.virtualNode;

            additionalPatches.push(function (parent) {

                mount(newNodeDef, parent, 'insertBefore', parent.childNodes[indexFromKey]);

            });

        } else {

            const newNodeDef = render(newVNode);
            newVChildren[i] = newNodeDef.virtualNode;

            additionalPatches.push(function (parent) {

                mount(newNodeDef, parent, 'appendChild');

            });

        }

    }


    if (additionalPatches.length + childPatches.length === 0) {

        return null;

    }

    return function (parent) {

        //zipping method is algorithm that sort patch and child to create a pair for patch the exact child
        zip(parent.childNodes, childPatches).forEach(([child, patch]) => {

            patch(child);

        });

        for (let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        return newVChildren;

    }

}