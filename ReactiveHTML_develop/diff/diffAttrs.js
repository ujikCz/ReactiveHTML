/**
 * check differences between old virtualNode attributes and new one
 * apply changes to realNode
 * @param { Object } oldAttrs - old virtual node attributes
 * @param { Object } newAttrs - new virtual node attributes
 */

import isNullOrUndef from '../isNullOrUndef.js';
import isObject from '../isObject.js';

export default function diffAttrs(oldAttrs, newAttrs) {

    const attrsPatches = [];

    for (const key in newAttrs) {

        if (key.startsWith('on')) {

            if (!(key in oldAttrs)) { // add event listeners

                attrsPatches.push(function (node) {

                    node.addEventListener(key.replace('on', ''), newAttrs[key]);

                });

            }

        } else if (isObject(newAttrs[key])) { // if is object set property by object assign

            attrsPatches.push(function (node) {

                Object.assign(node[key], newAttrs[key]);

            });

        } else if (newAttrs[key] !== oldAttrs[key] || !(key in oldAttrs)) {

            if(isNullOrUndef(newAttrs[key])) {

                attrsPatches.push(function (node) {

                    node.removeAttribute(key === 'className' ? 'class' : key);

                });

            } else if(key in node) {

                attrsPatches.push(function (node) {

                    node[key] = newAttrs[key];

                });

            } else {

                attrsPatches.push(function (node) {

                    node.setAttribute(key, newAttrs[key]);

                });

            }

        }

    }

    // remove old attributes
    for (const k in oldAttrs) {

        if (!(k in newAttrs)) {

            if (k.startsWith('on')) { // is event, remove event listener

                attrsPatches.push(function (node) {

                    node.removeEventListener(k.replace('on', ''), oldAttrs[k]);
                    return node;

                });

            } else { // else remove attribute from element

                attrsPatches.push(function (node) {

                    node.removeAttribute(k);
                    return node;

                });

            }

        }

    }

    if(!attrsPatches.length) return null;

    return function (node) {

        for (let i = 0; i < attrsPatches.length; i++) {

            attrsPatches[i](node);

        }

        return newAttrs;

    };

}
