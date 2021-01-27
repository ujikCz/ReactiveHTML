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
                    return node;

                });

            }

        } else if (isObject(newAttrs[key])) { // if is object set property by object assign

            attrsPatches.push(function (node) {

                switch(key) {

                    case 'classList': {

                        return diffClassList(oldAttrs[key], newAttrs[key])(node);

                    }

                    default: {

                        Object.assign(node[key], newAttrs[key]);
                        return node;

                    }
                }

            });

        } else if (newAttrs[key] !== oldAttrs[key] || !(key in oldAttrs)) {

            attrsPatches.push(function (node) {

                if(isNullOrUndef(newAttrs[key])) {

                    node.removeAttribute(key);

                } else {

                    node[key] = newAttrs[key];

                }

                return node;

            });

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

    return function (node) {

        for (let i = 0; i < attrsPatches.length; i++) {

            node = attrsPatches[i](node);

        }

        return [newAttrs, node];

    };

}


function diffClassList(oldClassList, newClassList) {

    const classListPatches = [];

    if(newClassList.length > oldClassList.length) {

        for(let i = 0; i < newClassList.length; i++) {

            if(!(oldClassList.includes(newClassList[i]))) {
    
                classListPatches.push(function(node) {
    
                    if(isNullOrUndef(newClassList[i])) {
    
                        node.classList.remove(oldClassList[i]);

                        if(!node.classList.length) {

                            node.removeAttribute('class');
        
                        }
    
                    } else {
    
                        node.classList.add(newClassList[i]);
    
                    }
    
                    return node;
    
                });
    
            }
    
        }

    }

    for(let i = 0; i < oldClassList.length; i++) {

        if(!(newClassList.includes(oldClassList[i]))) {

            classListPatches.push(function(node) {

                node.classList.remove(oldClassList[i]);

                if(!node.classList.length) {

                    node.removeAttribute('class');

                }

                return node;

            });

        }

    }

    return function(node) {

        for(let i = 0; i < classListPatches.length; i++) {

            node = classListPatches[i](node);

        }

        return node;

    }

}