/**
 * check differences between old virtualNode attributes and new one
 * apply changes to realNode
 * @param { Object } oldProps - old virtual node attributes
 * @param { Object } newProps - new virtual node attributes
 */

import isProperty from '../DOM/helpers/isProperty.js';
import isObject from '../isObject.js';
import diffChildren from './diffChildren.js';

export default function diffProps(oldProps, newProps) {

    const propsPatches = [];

    for (const key in newProps) {

        if(!isProperty(key)) {

            const [oldVChildren, newVChildren] = [oldProps[key], newProps[key]];

            const childrenPatches = diffChildren(oldVChildren, newVChildren);
            if(childrenPatches) {

                propsPatches.push(function(parent) {

                    newProps[key] = childrenPatches(parent);

                });

            }

        } else if (key.startsWith('on') && !(key in oldProps)) {

            propsPatches.push(function (node) {

                node.addEventListener(key.replace('on', ''), newProps[key]);

            });

        } else if (isObject(newProps[key])) { // if is object set property by object assign

            propsPatches.push(function (node) {

                Object.assign(node[key], newProps[key]);

            });

        } else if (newProps[key] !== oldProps[key] || !(key in oldProps)) {

            propsPatches.push(function (node) {

                node[key] = newProps[key];

            });

        }

    }

    // remove old attributes
    for (const k in oldProps) {

        if (!(k in newProps) && isProperty(k)) {

            if (k.startsWith('on')) { // is event, remove event listener

                propsPatches.push(function (node) {

                    node.removeEventListener(k.replace('on', ''), oldProps[k]);

                });

            } else { // else remove attribute from element

                propsPatches.push(function (node) {

                    node[k] = null;
                    node.removeAttribute(k);

                });

            }

        }

    }

    if (!propsPatches.length) return null;

    return function (node) {

        for (let i = 0; i < propsPatches.length; i++) {

            propsPatches[i](node);

        }

        return newProps;

    };

}