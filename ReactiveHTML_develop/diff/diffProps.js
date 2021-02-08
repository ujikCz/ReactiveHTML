/**
 * check differences between old virtualNode attributes and new one
 * apply changes to realNode
 * @param { Object } oldProps - old virtual node attributes
 * @param { Object } newProps - new virtual node attributes
 */

import getEventName from '../DOM/helpers/getEventName.js';
import isEvent from '../DOM/helpers/isEvent.js';
import isProperty from '../DOM/helpers/isProperty.js';
import isObject from '../isObject.js';
import diffChildren from './diffChildren.js';

export default function diffProps(oldProps, newProps) {

    const propsPatches = [];
    const updatedProps = {};

    for (const key in newProps) {

        let propChange = false;

        if (!isProperty(key)) {

            if (oldProps[key].length + newProps[key].length === 0) {

                updatedProps[key] = oldProps[key];

            } else {

                const childrenPatches = diffChildren(oldProps[key], newProps[key]);
                if (childrenPatches) {

                    propsPatches.push(function (parent) {

                        updatedProps[key] = childrenPatches(parent);

                    });

                } else {

                    updatedProps[key] = oldProps[key];

                }

            }

            continue;

        } else if (isEvent(key)) {

            if (!(key in oldProps)) {

                propsPatches.push(function (node) {

                    node.addEventListener(getEventName(key), newProps[key]);

                });

                propChange = true;

            }

        } else if (isObject(newProps[key])) { // if is object set property by object assign

            propsPatches.push(function (node) {

                Object.assign(node[key], newProps[key]);

            });

            propChange = true;

        } else if (newProps[key] !== oldProps[key] || !(key in oldProps)) {

            propsPatches.push(function (node) {

                node[key] = newProps[key];

            });

            propChange = true;

        }

        if (propChange) {

            updatedProps[key] = newProps[key];

        } else {

            updatedProps[key] = oldProps[key];

        }

    }

    Object.keys(oldProps)
        .filter(isProperty)
        .forEach(key => {
            if (!(key in newProps)) {

                if (isEvent(key)) { // is event, remove event listener

                    propsPatches.push(function (node) {

                        node.removeEventListener(getEventName(key), oldProps[key]);

                    });

                } else { // else remove attribute from element

                    propsPatches.push(function (node) {

                        node[key] = null;
                        node.removeAttribute(key);

                    });

                }

            }
        });

    if (!propsPatches.length) return null;

    return function (node) {

        for (let i = 0; i < propsPatches.length; i++) {

            propsPatches[i](node);

        }

        return updatedProps;

    };

}