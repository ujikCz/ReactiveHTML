
import { createProxyInContext } from './vnode/component.js';

export default class __observable_change {

    constructor(objectToObserve, component) {

        objectToObserve = new Proxy(objectToObserve, );

        component.observable.push();
        
        return [ objectToObserve, this.handler ];

    }

};