

export default function checkVirtual(virtual) {

    if(virtual === undefined) {

        throw TypeError(`Element method must return something that is not ${ undefined }, if you want to return nothing, just return ${ null }`);

    }

    return virtual;

}