
/**
 * if virtual of component is undefined or is not returned
 * @param { Object } virtual 
 */

export default function checkVirtual(virtual) {

    if(virtual === undefined || virtual === null) {

        throw TypeError(`Element cannot return nothing or null`);

    }

    return virtual;

}