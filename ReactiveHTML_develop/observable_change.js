
import { createProxyInContext } from './vnode/component.js';

export default class __observable_change {

    constructor(objectToObserve, ...components) {

        this.components = new Set(components);
        this.original = objectToObserve;

        this.observing = new Proxy(objectToObserve, createProxyInContext(components[0]));
        
        return [ this.observing, this ];

    }

    disconnect() {

        this.observing = this.original;

        return this;

    }

    add(...componentsToAdd) {

        componentsToAdd.forEach(componentToAdd => {

            this.components.add(componentToAdd);

        });

        return this;

    }

    remove(...componentsToRemove) {

        componentsToRemove.forEach(componentToRemove => {

            this.components.delete(componentToRemove);

        });

        return this;

    }

    connect(objectToObserve = {}) {

        this.observing = new Proxy(objectToObserve, createProxyInContext(...this.components));

        return this;

    }

};