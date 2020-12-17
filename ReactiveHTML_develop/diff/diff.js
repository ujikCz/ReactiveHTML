    /*
     *   check basic differences between old virtualNode and new one
     *   check attributes, events and styles changes
     *   apply all these changes to realNode
     */

    import diffAttrs from './diffAttrs.js';
    import diffChildren from './diffChildren.js';
    import diffStyles from './diffStyles.js';
    import render from '../DOM/render.js';
    import isObject from '../isObject.js';


    export default function diff(vOldNode, vNewNode) {

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

        if (vOldNode.tagName !== vNewNode.tagName) {
            return function (node) {
                const newNode = render(vNewNode);
                node.replaceWith(newNode);
                return newNode;
            };
        }

        /*
         *   creates all patch functions from diffing functions 
         */

        const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
        const patchChildren = diffChildren(vOldNode.children, vNewNode.children);
        const patchStyles = diffStyles(vOldNode.styles, vNewNode.styles);

        /*
         *   patch the real element with all patch functions 
         */

        return function (node) {
            patchAttrs(node);
            patchChildren(node);
            patchStyles(node);
            return node;
        };
    };