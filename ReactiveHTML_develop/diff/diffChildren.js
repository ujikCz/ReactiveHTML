import zip from './zip.js';
import diff from './diff.js';
import isArray from '../isArray.js';
import isObject from '../isObject.js';
import mount from '../DOM/mount.js';
import render from '../DOM/render.js';
import warn from '../warn.js';
import { KEY_CHILDREN_WARN } from '../constants.js';


/**
 * check differences between old virtualNode childNodes and new one
 * apply changes to realNode
 * @param { Array } oldVChildren - old virtual node children
 * @param { Array } newVChildren - new virtual node children
 */

export default function diffChildren(oldVChildren, newVChildren, shouldBeKeyed) {

    /**
     * filterNull filter every null elements in array and remove it, so we can easily recognize which array is smaller or bigger
     */


    const childPatches = [];
    const additionalPatches = [];

    /**
     * loop throught all oldVChildren and diff matched elements
     */

    for (let i = 0, l = oldVChildren.length; i < l; i++) {

        if (isArray(oldVChildren[i])) {

            additionalPatches.push(diffChildren(oldVChildren[i], newVChildren[i], true));

        } else {

            if (isObject(oldVChildren[i]) && oldVChildren[i]._key !== null) {

                childPatches.push(function (node) {

                    const findedByKey = newVChildren.find(f => f._key === oldVChildren[i]._key);
                    const indexInNewVChildren = newVChildren.indexOf(findedByKey);

                    [newVChildren[indexInNewVChildren], node] = diff(oldVChildren[i], findedByKey)(node);
                    return [newVChildren[indexInNewVChildren], node];

                });

            } else {

                if(shouldBeKeyed) {

                    warn(
                        `Children inside array should be keyed by _key attribute/prop, if you don't key your elements, it can cause redundant rerender or bad rerender`,
                        KEY_CHILDREN_WARN
                    );

                }

                childPatches.push(function (node) {

                    [newVChildren[i], node] = diff(oldVChildren[i], newVChildren[i])(node);

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

    function diffAditionalChildren(newVChildren, oldVChildren) {

        if (newVChildren.length > oldVChildren.length) {

            for (let i = 0, l = newVChildren.length; i < l; i++) {

                if (!isArray(newVChildren[i])) {

                    if (newVChildren[i]._key !== null) {

                        if (!oldVChildren.some(f => f._key === newVChildren[i]._key)) {

                            additionalPatches.push(function (parent) {

                                const vNewNode = render(newVChildren[i]);

                                newVChildren[i] = vNewNode.virtual;

                                if (i === (newVChildren.length - 1)) {

                                    mount(vNewNode, parent, 'appendChild');
                                    return [newVChildren, parent];

                                }

                                mount(vNewNode, parent, 'insertBefore', parent.childNodes[i]);

                                return [newVChildren, parent];

                            });

                        }

                    } else {

                        i = i + oldVChildren.length; //push index to the end of oldVChildren array so there are not already mounted children

                        additionalPatches.push(function (parent) {

                            const vNewNode = render(newVChildren[i]);

                            newVChildren[i] = vNewNode.virtual;

                            mount(vNewNode, parent, 'appendChild');

                            return [newVChildren, parent];

                        });

                    }

                } else {

                    diffAditionalChildren(newVChildren[i], oldVChildren[i] || []);

                }

            }

        }

    }

    diffAditionalChildren(newVChildren, oldVChildren);

    /*
     *   apply all childNodes changes to parent realNode
     *   it is parent cause in diff it is realDOM and we diffChildren of parent, so recursively this is parent in function argument
     */

    return function (parent) {

        //zipping method is algorithm that sort patch and child to create a pair for patch the exact child

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