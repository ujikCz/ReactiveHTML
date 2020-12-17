    /*
     *   flat array as much as possible
     *   if map method is used on array inside component 
     */

    export default function flatten(children) {
        return children.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }