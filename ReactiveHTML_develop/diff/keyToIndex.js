import isArray from "../isArray.js";
import isNullOrUndef from "../isNullOrUndef.js";


export default function keyToIndex(arr, ...prop) {

    const keyed = {};
    const free = [];

    for(let i = 0; i < arr.length; i++) {

        let arrItem = arr[i];

        if(isArray(arrItem)) {

            free.push(i);
            continue;

        }

        const objItem = prop[1] ? arrItem[prop[0]][prop[1]] : arrItem[prop[0]];

        if(!isNullOrUndef(objItem)) {

            keyed[objItem] = i;
            continue;

        } else {

            free.push(i);
            continue;

        }

    }

    return [
        keyed,
        free
    ];

}