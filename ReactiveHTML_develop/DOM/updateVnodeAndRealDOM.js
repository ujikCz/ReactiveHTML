/*
 *   updates virtualNode and its realNode (update whole component)
 */

import diff from '../diff/diff.js';
import getProto from '../getProto.js';
import applyLifecycle from '../applylifecycle.js';

export default function updateVnodeAndRealDOM(classLink) {
    const classLinkProto = getProto(classLink);
    const newVNode = classLinkProto.Element.bind(classLink)(classLink.props);

    if (classLink.Vnode.realDOM) {

        const patch = diff(classLink.Vnode, newVNode);
        newVNode.realDOM = patch(classLink.Vnode.realDOM);

    }

    applyLifecycle(classLinkProto.onComponentUpdate, classLink, classLink.props);

    Object.assign(classLink.Vnode, newVNode);

}