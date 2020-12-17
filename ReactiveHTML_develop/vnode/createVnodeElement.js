
/*
 *  creates virtual node 
 */

import flatten from './flatten.js';
import convertClassToVnode from './convertClassToVnode.js';
import filterAttrs from './filterAttrs.js';


export default function createVnodeElement(tagName, attrs = {}, ...children) {

    if (attrs === null) attrs = {};

    const filter = filterAttrs(attrs);

    return {
        tagName,
        attrs: filter.attrs,
        children: convertClassToVnode(flatten(children)),
        events: filter.events,
        styles: filter.styles
    }

}