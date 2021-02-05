import isArray from "../isArray.js";
import isObject from "../isObject.js";
import isEvent from "./helpers/isEvent.js";
import isProperty from "./helpers/isProperty.js";
import mount from "./mount.js";
import render from "./render.js";

/**
 * creates DOM element from virtual element
 * it create only pure HTMLElements, no text nodes or smth like that
 * @param { Object } vnode 
 */

export default function createDomElement(virtualNode) {

    /**
     * create element
     */

    const el = document.createElement(virtualNode.type);

    /**
     * add attributes, but like element properties for easy manipulation
     */
    const props = virtualNode.props;
    const newProps = {};

    Object.keys(props)
        .filter(isProperty)
        .forEach(key => {

            newProps[key] = props[key];

            if (isEvent(key)) {

                return el.addEventListener(getEventName(key), props[key]);

            }

            if (isObject(props[key])) {

                return Object.assign(el[key], props[key]);

            }

            return el[key] = props[key];

        });

    const children = props.children;
    const resChildren = [];

    if (children) {

        for (let i = 0; i < children.length; i++) {

            const elementDefinition = render(children[i]);

            if (isArray(elementDefinition)) {

                for (let j = 0; j < elementDefinition.length; j++) {

                    mount(elementDefinition[j], el, 'appendChild');

                }

            } else {

                mount(elementDefinition, el, 'appendChild');

            }

            resChildren.push(elementDefinition);

        }

    }

    return {
        virtualNode: {
            type: virtualNode.type,
            props: {
                children: resChildren,
                ...newProps
            },
            _key: virtualNode._key,
            _ref: virtualNode._ref
        },
        realDOM: el
    };
}