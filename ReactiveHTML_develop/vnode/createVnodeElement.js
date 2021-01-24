

/**
 * creates virtual node
 * @param { Component, tagName } type 
 * @param { props, attrs } attrs 
 * @param  { Array of vnodes } children 
 */

import isComponent from "../isComponent.js";
import isFunction from "../isFunction.js";

export default function createVnodeElement(type, props = null, ...children) {

    /**
     * get the _key that is originally in props/attributes of virtual element
     */

    let _key = null;
    if(props !== null && props._key !== undefined) {

        _key = props._key;
        Reflect.deleteProperty(props, '_key');

    }

    props = props || {};
    
    /**
     * if element is component
     */

    if(isComponent(type)) {

        /**
         * returning children as props we can create components like this:
         * <Component>${ 4 + 1 }</Component>
         * in this example our children prop is (5)
         */

        if(children.length) {

            props = {
                children,
                ...props
            }

        }

        return {
            type,
            props,
            _key
        }

    }

    if(isFunction(type) || !(typeof type === 'string' || type instanceof String)) {

        throw TypeError(`createElement(...) type can be only Component or String as tag of Element`);

    }


    /**
     * if element is basic virtual node element
     */

    return {
        type,
        attrs: props,
        children,
        _key
    }

}