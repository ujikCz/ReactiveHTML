import isObject from "../isObject.js";


export default function resolveRef(ref, newRealNode) {

    if(isObject(ref)) {

        return {
            node: newRealNode,
            resolved: true
        };

    }

    throw Error(`_ref can be only ReactiveHTML.ref() Object, use ref() function to create ref of virtual node`);

}