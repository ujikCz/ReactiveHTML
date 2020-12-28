/**
 * convert attrs object to 3 objects [ attrs, events, styles ]
 * @param { Object } attrs - all not sorted attrs
 */

export default function filterAttrs(attrs) {

    let events = {};
    let styles = {};

    for (const [k, v] of Object.entries(attrs)) {

        if (k.startsWith('on')) {

            events[k.replace('on', '')] = v;
            delete attrs[k];

        }

        if (k === 'style') {

            styles = v;
            delete attrs[k];

        }
    }

    return {

        attrs,
        events,
        styles,

    };

}