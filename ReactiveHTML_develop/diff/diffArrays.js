import zip from './zip.js';
import render from '../DOM/render.js';
import diff from './diff.js';

/**
 * get differences between two arrays with keys and apply it to real dom node
 * @param { Array } oldArray 
 * @param { Array } newArray 
 */

export default function diffArrays(oldArray, newArray) {

    const arrayPatches = [];

    for (const oldNode of oldArray) {

        /**
         * if element cannot be found by find => undefined => oldNode will be removed
         */

        if(oldNode._key === undefined) {

            console.warn('You have to specify :key attribute or prop to make your list trully reactive');

        }

        arrayPatches.push(diff(oldNode, newArray.find(f => f._key === oldNode._key)));

    }

    const additionalPatches = [];

    for (const additionalVChild of newArray.slice(oldArray.length)) {

        additionalPatches.push(function (node) {
            node.appendChild(render(additionalVChild));
            return node;
        });

    }

    /**
     * apply changes to real dom node
     */

    return function (parent) {

        for (const [patch, child] of zip(arrayPatches, parent.childNodes)) {

            patch(child);

        }

        for (const additionalPatch of additionalPatches) {

            additionalPatch(parent);

        }

        return parent;

    };

}