import isArray from "../isArray.js";
import mount from "./mount.js";
import render from "./render.js";


export default function createDomElement(vnode) {

    const el = document.createElement(vnode.type);

    for (const key in vnode.attrs) {

        if (key.startsWith('on')) {

            el.addEventListener(key.replace('on', ''), vnode.attrs[key]);
            continue;

        } else if (isObject(vnode.attrs[key])) {

            Object.assign(el[key], vnode.attrs[key]);
            continue;

        } else {

            el[key] = vnode.attrs[key];

        }

    }

    if (vnode.children.length) {

        for (let i = 0, ch = vnode.children; i < ch.length; i++) {

            const rendered = render(ch[i]);

            if(isArray(rendered)) {

                for(let j = 0; j < rendered.length; j++) {

                    const renderedFromArray = render(rendered[j]);
                    rendered[j] = renderedFromArray;
                    mount(renderedFromArray, el, 'appendChild');

                }

                vnode.children[i] = rendered;

            } else {

                vnode.children[i] = rendered;
                mount(rendered, el, 'appendChild');

            }

        }

    }

    return el;

}