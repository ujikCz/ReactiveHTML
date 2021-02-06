

export default function keyToIndex(arr) {

    const keyed = {};
    const free = [];

    for(let i = 0; i < arr.length; i++) {

        const arrItem = arr[i];

        if(arrItem._key) {

            keyed[arrItem._key] = i;

        } else {

            free.push(i);

        }

    }

    return [
        keyed,
        free
    ];

}