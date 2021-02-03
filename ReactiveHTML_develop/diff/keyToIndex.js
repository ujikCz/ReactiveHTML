

export default function keyToIndex(arr) {

    const keyed = {};

    for(let i = 0; i < arr.length; i++) {

        const arrItem = arr[i];

        if(arrItem._key) {

            keyed[arrItem._key] = i;

        }

    }

    return keyed;

}