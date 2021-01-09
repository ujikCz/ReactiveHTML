/**
 * check differences between old virtualNode attributes and new one
 * apply changes to realNode
 * @param { Object } oldAttrs - old virtual node attributes
 * @param { Object } newAttrs - new virtual node attributes
 */

export default function diffAttrs(oldAttrs, newAttrs, styles = false) {

    const attrsPatches = [];

    for (const k in newAttrs) {

        if (k.startsWith('on')) {

            continue;

        } else if (k === 'style') {

            attrsPatches.push(
                diffAttrs(oldAttrs[k], newAttrs[k], true)
            );

        } else if (newAttrs[k] !== oldAttrs[k]) {

            attrsPatches.push(
                function (node) {

                    if (styles) {

                        node.style[k] = newAttrs[k];
                        return node;

                    }

                    if (k === 'value') {
                        node.value = newAttrs[k];
                    }

                    node.setAttribute(k, newAttrs[k]);
                    return node;
                }
            );

        }

    }

    // remove old attributes
    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            attrsPatches.push(
                function (node) {

                    if (styles) {

                        node.style[k] = null;
                        return node;

                    }

                    node.removeAttribute(k);
                    return node;
                }
            );
        }
    }



    return function (node) {
        for (const patchattr of attrsPatches) {
            patchattr(node);
        }
    };

}