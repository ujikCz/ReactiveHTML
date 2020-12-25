

/**
 * check differences between old virtualNode styles and new one
 * apply changes to realNode
 * @param { Object } oldStyles - old virtual node styles
 * @param { Object } newStyles - new virtual node styles
 */

export default function diffStyles(oldStyles, newStyles) {

    const stylesPatches = [];

    for (const [k, v] of Object.entries(newStyles)) {
        if (v !== oldStyles[k]) {
            stylesPatches.push(
                function (node) {
                    node.style[k] = v;
                    return node;
                }
            );
        }
    }

    // remove old attributes
    for (const k in oldStyles) {
        if (!(k in newStyles)) {
            stylesPatches.push(
                function (node) {
                    node.style[k] = null;
                    return node;
                }
            );
        }
    }

    return function (node) {
        for (const patchstyle of stylesPatches) {
            patchstyle(node);
        }
    };

}