
import { createProxyInContext } from './vnode/component.js';

export default class __observable_change {

    constructor(objectToObserve, ...components) {

        this.components = new Set(components);
        this.original = objectToObserve;
        const scope = this;

        this.handler = {

            disconnect: function() {

                this.observing = this.original;
                return this;
    
            }.bind(scope),

            add: function() {
                


            }.bind(scope),

            remove: function() {



            }.bind(scope)

        };

        this.observing = new Proxy(objectToObserve, createProxyInContext(components[0]));

        components.forEach(component => {

            component.additionalObservable = this;

        });
        
        return [ this.observing, this.handler ];

    }

    disconnect() {



    }

    observe(...componentsToAdd) {

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

};