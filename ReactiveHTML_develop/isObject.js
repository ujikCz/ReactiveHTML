
/**
 * check if is object
 * @param { ...any } object 
 */

export default function isObject(object) {

    return (typeof object === 'object' && object !== null);

}