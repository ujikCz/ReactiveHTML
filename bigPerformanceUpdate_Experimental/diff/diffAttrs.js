/**
 * check differences between old virtualNode attributes and new one
 * apply changes to realNode
 * @param { Object } oldAttrs - old virtual node attributes
 * @param { Object } newAttrs - new virtual node attributes
 */

import isObject from '../isObject.js';

export default function diffAttrs(oldAttrs, newAttrs) {

    const attrsPatches = [];

    for (const key in newAttrs) {

        if (key.startsWith('on')) {

            continue;

        } else if(isObject(newAttrs[key])) {
            
            attrsPatches.push(function(node) {

                Object.assign(node[key], newAttrs[key]);
                return node;

            });

            continue;

        } else {

            attrsPatches.push(function(node) {

                node[key] = newAttrs[key];
                return node;

            });
            
        }

    }

    // remove old attributes
    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            attrsPatches.push(
                function (node) {

                    node.removeAttribute(k);
                    return node;

                }
            );
        }
    }



    return function (node) {

        for(let i = 0; i < attrsPatches.length; i++) {

            attrsPatches[i](node);

        }

    };

}