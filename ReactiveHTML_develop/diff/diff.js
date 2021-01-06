

    import diffAttrs from './diffAttrs.js';
    import diffChildren from './diffChildren.js';
    import diffStyles from './diffStyles.js';
    import render from '../DOM/render.js';
    import isObject from '../isObject.js';

    /**
     * check basic differences between old virtualNode and new one
     * check attributes, events and styles changes
     * apply all these changes to realNode
     * @param { Object } vOldNode - old virtual node tree
     * @param { Object } vNewNode - new virtual node tree
     */

    export default function diff(vOldNode, vNewNode) {

        /*
         * if it is component, return node only, update is pathed already cause updateVnodeAndRealDOM patch all components
         */


        if(isObject(vOldNode) && vOldNode.__component__ && isObject(vNewNode) && vNewNode.__component__) {

            return node => node; 

        }

        /*
         *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
         */

        if (vNewNode === undefined) {

            return function (node) {
                node.remove();
                return undefined;
            };

        }

        /*
         *   if both are not a virtual node, it is text node, so replace its value 
         */

        if(!isObject(vOldNode) && !isObject(vNewNode)) {

            if (vOldNode !== vNewNode) {

                return function(node) {

                    node.nodeValue = vNewNode;

                }

            } else {
                return node => undefined;
            }

        }

        /*
         *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
         */

        if (!isObject(vOldNode) || !isObject(vNewNode)) {

            if (vOldNode !== vNewNode) {

                return function (node) {
                    const newNode = render(vNewNode);
                    node.replaceWith(newNode);
                    return newNode;
                };

            } else {
                return node => undefined;
            }

        }

        /*
         *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
         */

        if (vOldNode.type !== vNewNode.type) {
            return function (node) {
                const newNode = render(vNewNode);
                node.replaceWith(newNode);
                return newNode;
            };
        }

        /*
         *   creates all patch functions from diffing functions 
         */

        let patchAttrs, patchStyles, patchChildren;

        if(vOldNode.attrs !== null) {

            if(Object.keys(vOldNode.attrs.basic).length + Object.keys(vNewNode.attrs.basic).length !== 0) {

                patchAttrs = diffAttrs(vOldNode.attrs.basic, vNewNode.attrs.basic);

            }

            if(Object.keys(vOldNode.attrs.styles).length + Object.keys(vNewNode.attrs.styles).length !== 0) {

                patchStyles = diffStyles(vOldNode.attrs.styles, vNewNode.attrs.styles);

            }

        }

        if( (vOldNode.children.length + vNewNode.children.length) !== 0) {

            patchChildren = diffChildren(vOldNode.children, vNewNode.children);

        }
        

        /*
         *   patch the real element with all patch functions 
         */

        return function (node) {

            if(patchAttrs) {

                patchAttrs(node);
                patchStyles(node);

            }

            if(patchChildren) {

                patchChildren(node);

            }
            
            return node;
        };
    };