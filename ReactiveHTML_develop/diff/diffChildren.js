import zip from './zip.js';
import render from '../DOM/render.js';
import diff from './diff.js';
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

    for (let i = 0, l = oldVChildren.length; i < l; i++) {

        if (isArray(oldVChildren[i])) {

            additionalPatches.push(diffChildren(oldVChildren[i], newVChildren[i]));

        } else {

            if (oldVChildren[i]._key !== null) {

                const pairByKey = newVChildren.find(f => f._key === oldVChildren[i]._key);

                childPatches.push(diff(oldVChildren[i], pairByKey));

                newVChildren[newVChildren.indexOf(pairByKey)] = oldVChildren[i];

            } else {

                childPatches.push(diff(oldVChildren[i], newVChildren[i]));

                newVChildren[i] = oldVChildren[i];

            }

        }

    }

    if (newVChildren.length > oldVChildren.length) {

        for (let i = 0, l = newVChildren.length; i < l; i++) {

            if (!isArray(newVChildren[i])) {

                if (newVChildren[i]._key !== null) {

                    if (!oldVChildren.some(f => f._key === newVChildren[i]._key)) {

                        additionalPatches.push(function (node) {

                            const newVNode = render(newVChildren[i]);

                            newVChildren[i] = newVNode;

                            if (i === (newVChildren.length - 1)) {

                                node.appendChild(newVNode.ref.realDOM);

                            }

                            node.insertBefore(newVNode.ref.realDOM, node.childNodes[i]);

                        });

                    }

                } else {

                    i = oldVChildren.length;

                    additionalPatches.push(function (node) {

                        const newVNode = render(newVChildren[i]);

                        newVChildren[i] = newVNode;

                        node.appendChild(newVNode.ref.realDOM);

                    });

                }

            }

        }

    }


    /*
     *   apply all childNodes changes to parent realNode
     */

    return function (parent) {

        zip(childPatches, parent.childNodes).forEach(([patch, child]) => {

            patch(child);

        });


        for (let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        return parent;
    };
};