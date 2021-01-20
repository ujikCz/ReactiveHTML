import zip from './zip.js';
import filterVirtualElements from '../vnode/filterVirtualElements.js';
import diff from './diff.js';
import isArray from '../isArray.js';
import isObject from '../isObject.js';
import mount from '../DOM/mount.js';


/**
 * check differences between old virtualNode childNodes and new one
 * apply changes to realNode
 * @param { Array } oldVChildren - old virtual node children
 * @param { Array } newVChildren - new virtual node children
 */

function filterNull(array) {

    return array.filter(undefFilter => {

        return undefFilter !== null;

    });

}

export default function diffChildren(oldVChildren, newVChildren) {

    /**
     * filterNull filter every null elements in array and remove it, so we can easily recognize which array is smaller or bigger
     */

    [oldVChildren, newVChildren] = [filterNull(oldVChildren), filterNull(newVChildren)];
    
    const childPatches = [];
    const additionalPatches = [];

    /**
     * loop throught all oldVChildren and diff matched elements
     */

    for (let i = 0, l = oldVChildren.length; i < l; i++) {

        if (isArray(oldVChildren[i])) {

            additionalPatches.push(diffChildren(oldVChildren[i], newVChildren[i]));

        } else {

            if (isObject(oldVChildren[i]) && oldVChildren[i]._key !== null) {

                childPatches.push(function (node) {

                    const findedByKey = newVChildren.find(f => f._key === oldVChildren[i]._key);
                    const indexInNewVChildren = newVChildren.indexOf(findedByKey);

                    [newVChildren[indexInNewVChildren], node] = diff(oldVChildren[i], findedByKey || null)(node);
                    return [newVChildren[indexInNewVChildren], node];

                });

            } else {

                childPatches.push(function (node) {

                    [newVChildren[i], node] = diff(oldVChildren[i], newVChildren[i] || null)(node);
                    return [newVChildren[i], node];

                });

            }

        }

    }

    /**
     * get additional children if newVChildren array is bigger than old one
     * if elements in new array has keys insert it on specific position
     * else append it as last element of parent
     */

    if (newVChildren.length > oldVChildren.length) {

        for (let i = 0, l = newVChildren.length; i < l; i++) {

            if (!isArray(newVChildren[i])) {

                if (newVChildren[i]._key !== null) {

                    if (!oldVChildren.some(f => f._key === newVChildren[i]._key)) {

                        additionalPatches.push(function (parent) {

                            const newVNode = filterVirtualElements(newVChildren[i]);

                            newVChildren[i] = newVNode;

                            if (i === (newVChildren.length - 1)) {

                                mount(newVNode, parent, 'appendChild');
                                return [newVNode, parent];

                            }

                            mount(newVNode, parent, 'insertBefore', node.childNodes[i]);
                            return [newVNode, parent];

                        });

                    }

                } else {

                    i = oldVChildren.length;

                    additionalPatches.push(function (parent) {

                        const newVNode = filterVirtualElements(newVChildren[i]);

                        newVChildren[i] = newVNode;

                        mount(newVNode, parent, 'appendChild');

                        return [newVNode, parent];

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

        /**
         * apply additional changes right to the parent
         */

        for (let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        return [newVChildren, parent];
    };

}