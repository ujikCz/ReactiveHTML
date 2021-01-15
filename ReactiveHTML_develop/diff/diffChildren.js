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

                childPatches.push(function(node) {

                    const findedByKey = newVChildren.find(f => f._key === oldVChildren[i]._key);
                    const indexInNewVChildren = newVChildren.indexOf(findedByKey);

                    [newVChildren[indexInNewVChildren], node] = diff(oldVChildren[i], findedByKey)(node);
                    return [newVChildren[indexInNewVChildren], node];

                });

            } else {

                childPatches.push(function(node) {
                    
                    [newVChildren[i], node] = diff(oldVChildren[i], newVChildren[i])(node);
                    return [newVChildren[i], node];

                });

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
                                return [newVNode, node];

                            }

                            node.insertBefore(newVNode.ref.realDOM, node.childNodes[i]);
                            return [newVNode, node];

                        });

                    }

                } else {

                    i = oldVChildren.length;

                    additionalPatches.push(function (node) {

                        const newVNode = render(newVChildren[i]);

                        newVChildren[i] = newVNode;

                        node.appendChild(newVNode.ref.realDOM);

                        return [newVNode, node];

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

        return [newVChildren, parent];
    };
};