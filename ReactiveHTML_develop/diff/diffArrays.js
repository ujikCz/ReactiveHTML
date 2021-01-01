
import zip from './zip.js';
import render from '../DOM/render.js';
import diff from './diff.js';


export default function diffArrays(oldArray, newArray) {

    const arrayPatches = [];

    for(const oldNode of oldArray) {

        arrayPatches.push(diff(oldNode, newArray.find(f => f._key === oldNode._key)));

    }

    const additionalPatches = [];

    for(const additionalVChild of newArray.slice(oldArray.length)) {

        additionalPatches.push(function (node) {
            node.appendChild(render(additionalVChild));
            return node;
        });

    }

    return function(parent) {

        for (const [patch, child] of zip(arrayPatches, parent.childNodes)) {
            patch(child);
        }

        for(const additionalPatch of additionalPatches) {

            additionalPatch(parent);

        }

        return parent;

    };

}