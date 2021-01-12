

    /**
     * formate patch and element besides
     * do it for minimal times (means if patches are smaller than elements, do it only for patches and the same for elements)
     * @param { Array } first 
     * @param { Array } second 
     */

    export default function zip(first, second) {

        const zipped = [];
        for (let i = 0; i < Math.min(first.length, second.length); i++) {
            zipped.push([first[i], second[i]]);
        }

        return zipped;

    }