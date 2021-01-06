

import isObject from './isObject.js';
import isArray from './isArray.js';

/**
 * creates copy of Object without any references, so updating copy will not affect original object
 * @param { ...any } object 
 */

export default function cloneObjectWithoutReference(object) {

    if(!isObject(object)) {

        return object;

    }

    const clone = isArray(object) ? [] : {};

    for(const k in object) {

        clone[k] = cloneObjectWithoutReference(object[k]);

    }

    return clone;

}

