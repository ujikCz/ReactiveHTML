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

    const childPatches = [];
    const additionalPatches = [];

    const [ keyedOld, freeOld ] = keyToIndex(oldVChildren, 'virtualNode', '_key');
    const [ keyedNew, freeNew ] = keyToIndex(newVChildren, '_key');

    for(const key in keyedNew) {    

        const newIndex = keyedNew[key];

        if(key in keyedOld) {

            const oldIndex = keyedOld[key];
            delete keyedOld[key];

            const [diffPatch, diffChanges] = diff(oldVChildren[oldIndex].virtualNode, newVChildren[newIndex]);

            if(diffChanges) {

                childPatches.push(function(node) {

                    newVChildren[newIndex] = {
                        virtualNode: diffPatch(node),
                        realDOM: node
                    };
    
                });

            }
            
        } else {

            newVChildren[newIndex] = render(newVChildren[newIndex]);

            additionalPatches.push(function(parent) {

                const parentChildNodes = parent.childNodes;

                mount(newVChildren[newIndex], parent, 'insertBefore', parentChildNodes[newIndex]);
                
            });
            //add
        }

    }

    for(const key in keyedOld) {

        const oldIndex = keyedOld[key];

        childPatches.push(function(node) {

            diff(oldVChildren[oldIndex].virtualNode, undefined)[0](node);

        });

    }

    const freeZipLen = Math.max(freeNew.length, freeOld.length);

    for(let i = 0; i < freeZipLen; i++) {

        const index = freeNew[i];

        if(i in freeOld) {
            //update
            const oldItem = oldVChildren[index];

            if(isArray(oldItem)) {

                const [recursionPatch, recursionChanges] = diffChildren(oldItem, newVChildren[index])

                if(recursionChanges) {

                    additionalPatches.push(recursionPatch);

                }

            } else {

                const [patch, changes] = diff(oldItem.virtualNode, newVChildren[index]);

                if(changes) {
                    
                    childPatches.push(function(node) {

                        newVChildren[index] = {
                            virtualNode: patch(node),
                            realDOM: node
                        };
    
                    });

                } else {

                    newVChildren[index] = oldVChildren[index];

                }


            }

        } else {
            //add
            newVChildren[index] = render(newVChildren[index]);

            additionalPatches.push(function(parent) {

                mount(newVChildren[index], parent, 'appendChild');

            });

        }

    }

    return [function (parent) {

        //zipping method is algorithm that sort patch and child to create a pair for patch the exact child

        const zipLen = Math.min(oldVChildren.length, childPatches.length);

        for(let i = 0; i < zipLen; i++) {

            childPatches[i](oldVChildren[i].realDOM);
            
        }

        for(let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }
 
        return newVChildren;
        
    }, additionalPatches.length + childPatches.length];

}


