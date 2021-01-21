import zip from './zip.js';
import filterVirtualElements from '../vnode/filterVirtualElements.js';
import diff from './diff.js';
import isArray from '../isArray.js';
import isObject from '../isObject.js';
import mount from '../DOM/mount.js';
import render from '../DOM/render.js';


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

            additionalPatches.push(function(parent) {

                [newVChildren[i], parent] = diffChildren(oldVChildren[i], newVChildren[i])(parent);
                return [newVChildren[i], parent];

            });

        } else {

            if (isObject(oldVChildren[i]) && oldVChildren[i]._key !== null) {

                childPatches.push(function (node, parentNode) {

                    const findedByKey = newVChildren.find(f => f._key === oldVChildren[i]._key);
                    const indexInNewVChildren = newVChildren.indexOf(findedByKey);

                    [newVChildren[indexInNewVChildren], node] = diff(oldVChildren[i], findedByKey)(node, parentNode);
                    return [newVChildren[indexInNewVChildren], node];

                });

            } else {

                childPatches.push(function (node, parentNode) {

                    [newVChildren[i], node] = diff(oldVChildren[i], newVChildren[i])(node, parentNode);
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

                            const newNode = render(newVChildren[i], parent);

                            if (i === (newVChildren.length - 1)) {

                                mount(newVNode, newNode, parent, 'appendChild');
                                return [newVNode, parent];

                            }

                            mount(newVNode, newNode, parent, 'insertBefore', parent.childNodes[i]);
                            return [newVNode, parent];

                        });

                    }

                } else {

                    i = i + oldVChildren.length;

                    additionalPatches.push(function (parent) {

                        newVChildren[i] = filterVirtualElements(newVChildren[i]);
                        const newNode = render(newVChildren[i], parent);

                        mount(newVChildren[i], newNode, parent, 'appendChild');

                        return [newVChildren, parent];

                    });

                }

            }

        }

    }


    /*
     *   apply all childNodes changes to parent realNode
     */

    return function (parent) {
        
        parent = parent.ref ? parent.ref.realDOM : parent

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