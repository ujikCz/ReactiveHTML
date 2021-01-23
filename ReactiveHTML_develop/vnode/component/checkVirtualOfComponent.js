
/**
 * if virtual of component is undefined or is not returned
 * @param { Object } virtual 
 */

export default function checkVirtual(virtual) {

    if(virtual === undefined || virtual === null) {

        throw TypeError(`Element method must return something that is not ${ undefined }, your Element return undefined or virtual node is not returned. If you want to return nothing, just return ${ null }.`);

    }

    return virtual;

}