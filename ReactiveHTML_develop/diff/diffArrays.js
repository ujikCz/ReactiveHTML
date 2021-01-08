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

    for(let i = 0; i < oldArray.length; i++) {

        /**
         * if element cannot be found by find => undefined => oldNode will be removed
         */

        arrayPatches.push(diff(oldArray[i], newArray.find(f => f._key === oldArray[i]._key)));

    }

    const additionalPatches = [];

    for(let i = 0, additionalVChildren = newArray.slice(oldArray.length); i < additionalVChildren.length; i++) {

        additionalPatches.push(function (node) {
            return render(additionalVChildren[i], function(newNode) {
                node.appendChild(newNode);
            });
        });

    }


    /**
     * apply changes to real dom node
     */

    return function (parent) {

        for (const [patch, child] of zip(arrayPatches, parent.childNodes)) {

            patch(child);

        }

        for(let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        return parent;

    };

}