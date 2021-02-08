import isArray from "../isArray.js";
import isObject from "../isObject.js";
import getEventName from "./helpers/getEventName.js";
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

                mountArrays(elementDefinition, el);

            } else {

                mount(elementDefinition,
                    el,
                    () => {
                        el.appendChild(elementDefinition.realDOM);
                    });

            }

            resChildren.push(elementDefinition);

        }

    }

    const key = virtualNode._key;

    return {
        virtualNode: {
            type: virtualNode.type,
            props: {
                children: resChildren,
                ...newProps
            }
        },
        realDOM: el,
        _key: key,
        _ref: virtualNode._ref
    };
}

function mountArrays(elementDefinition, el) {

    for (let j = 0; j < elementDefinition.length; j++) {
        const singleElementDefinition = elementDefinition[j];

        if (isArray(singleElementDefinition)) {

            mountArrays(singleElementDefinition, el);

        } else {

            mount(singleElementDefinition,
                el,
                () => {
                    el.appendChild(singleElementDefinition.realDOM);
                });

        }

    }

}