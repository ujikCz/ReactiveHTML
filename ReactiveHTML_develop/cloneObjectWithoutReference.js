
/**
 * creates copy of Object without any references, so updating copy will not affect original object
 * @param { ...any } object 
 */

export default function cloneObjectWithoutReference(object) {

    if(object instanceof Array) {

        return object.map(item => cloneObjectWithoutReference(item));

    }

    if(object instanceof Object) {

        const clone = {};

        for(const [k, v] of Object.entries(object)) {

            clone[k] = cloneObjectWithoutReference(v);

        }

        return clone;

    }

    return object;

}