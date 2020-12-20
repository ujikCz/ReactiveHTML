

    /**
     * flat array as much as possible
     * if map method is used on array inside component 
     * @param { Array } array 
     */

    export default function flatten(array) {
        return array.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }