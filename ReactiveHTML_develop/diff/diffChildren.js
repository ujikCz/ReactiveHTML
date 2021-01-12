import zip from './zip.js';
import render from '../DOM/render.js';
import diff from './diff.js';
import isArray from '../isArray.js';


/**
 * check differences between old virtualNode childNodes and new one
 * apply changes to realNode
 * @param { Array } oldVChildren - old virtual node children
 * @param { Array } newVChildren - new virtual node children
 */

export default function diffChildren(oldVChildren, newVChildren) {

    const childPatches = [];
    const additionalPatches = [];

    for(let i = 0, l = oldVChildren.length; i < l; i++) {

        if(isArray(oldVChildren[i])) {

            additionalPatches.push(diffChildren(oldVChildren[i], newVChildren[i]));

        } else { 

            if(oldVChildren[i]._key !== null) {
                
                childPatches.push(diff(oldVChildren[i], newVChildren.find(f => f._key === oldVChildren[i]._key)));
                
            } else {

                childPatches.push(diff(oldVChildren[i], newVChildren[i]));

            }

        }

    }

    for(let i = 0, l = newVChildren.length; i < l; i++) {

        if(!isArray(newVChildren[i])) {

            if(newVChildren[i]._key !== null) {

                if(!oldVChildren.some(f => f._key === newVChildren[i]._key)) {

                    additionalPatches.push(function(node) {

                        return render(newVChildren[i], function(newNode) {
                            
                            if(i === (newVChildren.length - 1)) {

                                return node.appendChild(newNode);

                            } 

                            return node.insertBefore(newNode, node.childNodes[i]);
    
                        });
    
                    });
    
                }

            } else {

                additionalPatches.push(function (node) {

                    return render(newVChildren[i], function(newNode) {

                        node.appendChild(newNode);

                    });

                });

            }

        } 

    }

    /*
     *   apply all childNodes changes to parent realNode
     */

    return function (parent) {

        if(parent) { // check if parent exists cause async operations (fetch, async/await, Promises)

            zip(childPatches, parent.childNodes).forEach(([patch, child]) => {

                patch(child);
    
            });

        }


        for(let i = 0; i < additionalPatches.length; i++) {

            additionalPatches[i](parent);

        }

        return parent;
    };
};