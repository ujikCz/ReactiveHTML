

import zip from './zip.js';
import render from '../DOM/render.js';
import diff from './diff.js';

/**
 * check differences between old virtualNode childNodes and new one
 * apply changes to realNode
 * @param { Array } oldVChildren - old virtual node children
 * @param { Array } newVChildren - new virtual node children
 */

export default function diffChildren(oldVChildren, newVChildren) {
    const childPatches = [];

    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(diff(oldVChild, newVChildren[i]));
    });

    /*
     *   if that virtualNode is not in old virtualNode parent, but in new it is, append it
     */

    const additionalPatches = [];
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push(function (node) {
            node.appendChild(render(additionalVChild));
            return node;
        });
    }
    /*
     *   apply all childNodes changes to parent realNode
     */

    return function (parent) {
        for (const [patch, child] of zip(childPatches, parent.childNodes)) {
            patch(child);
        }

        for (const patch of additionalPatches) {
            patch(parent);
        }

        return parent;
    };
};