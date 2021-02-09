

export default function keyToIndex(arr) {

    const keyed = {};
    const free = [];

    for(let i = 0; i < arr.length; i++) {

        const arrItem = arr[i];
        const key = arrItem._key;

        if(key) {

            if(!(key in keyed)) {
                
                keyed[key] = i;

            }

        } else {

            free.push(i);

        }

    }

    return [
        keyed,
        free
    ];

}