
/**
 * if virtual of component is undefined or is not returned
 * @param { Object } virtual 
 */

import isNullOrUndef from "../../isNullOrUndef.js";

export default function checkVirtual(virtual) {

    if(isNullOrUndef(virtual)) {

        throw Error(`Element cannot return undefined or null`);

    }

    return virtual;

}