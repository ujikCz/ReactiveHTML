

export default function filterKey(attrs) {

    let _key = null;
    let _keyObjectKey = ':key';

    if (attrs === null) {

        return {
            attrs: {},
            _key
        };

    }


    if (_keyObjectKey in attrs) {

        _key = attrs[_keyObjectKey];
        delete attrs[_keyObjectKey];

    }

    return {

        attrs,
        _key

    }

}