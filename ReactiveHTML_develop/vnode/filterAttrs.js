/**
 * convert attrs object to 3 objects [ attrs, events, styles ]
 * @param { Object } basic - all not sorted attrs
 */

export default function filterAttrs(basic) {

    let events = {};
    let styles = {};

    for (const [k, v] of Object.entries(basic)) {

        if (k.startsWith('on')) {

            events[k.replace('on', '')] = v;
            delete basic[k];

        }

        if (k === 'style') {

            styles = v;
            delete basic[k];

        }
    }

    return {

        basic,
        events,
        styles,

    };

}