    /*
     *   check __proto__ of object, if it is component return its virtualNode else return object 
     */

    import isObject from '../isObject.js';
    import getProto from '../getProto.js';
    import componentClass from '../vnode/component.js';



    export default function checkProto(object) {

        if (
            !isObject(object) || 
            !getProto(object) || 
            !getProto(getProto(object))
        ) return object;

        let proto = getProto(getProto(object));

        if (proto.constructor.name === 'Component' && getProto(proto).isPrototypeOf(componentClass)) {
            object.Vnode.realDOM = null;
            return object.Vnode;
        }

        return object;

    }