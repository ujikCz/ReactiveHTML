import zip from './zip.js';
import render from '../DOM/render.js';
import diff from './diff.js';
import diffArrays from './diffArrays.js';
import isArray from '../isArray.js';


/**
 * check differences between old virtualNode childNodes and new one
 * apply changes to realNode
 * @param { Array } oldVChildren - old virtual node children
 * @param { Array } newVChildren - new virtual node children
 */

export default function diffChildren(oldVChildren, newVChildren) {
    const childPatches = [];
    const additionalPatches = [];

    for(let i = 0, l = oldVChildren.length; i < l; i++) {

        if(isArray(oldVChildren[i])) {

            additionalPatches.push(diffArrays(oldVChildren[i], newVChildren[i]));

        } else {

            childPatches.push(diff(oldVChildren[i], newVChildren[i]));

        }

    }

    /*
     *   if that virtualNode is not in old virtualNode parent, but in new it is, append it
     */

    for(let i = 0, additionalVChildren = newVChildren.slice(oldVChildren.length); i < additionalVChildren.length; i++) {

        additionalPatches.push(function (node) {
            return render(additionalVChildren[i], function(newNode) {
                node.appendChild(newNode);
            });
        });

    }

    /*
     *   apply all childNodes changes to parent realNode
     */

    return function (parent) {
        
        for (const [patch, child] of zip(childPatches, parent.childNodes)) {

            patch(child);

        }

        for(let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        return parent;
    };
};
