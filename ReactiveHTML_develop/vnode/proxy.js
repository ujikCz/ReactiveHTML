
/**
 * creates Proxy object to observe values and trigger changes
 * @param { Object } obj - object to observe
 * @param { Function } hook - callback
 */

export default function deepProxy(obj, hook) {

    return new Proxy(obj, {

        get(target, property, receiver) {

            if(target instanceof Set || target instanceof WeakSet) {

                switch (property) {
                    case "unionWith": {
    
                        return function (set) {
    
                            return new Set([...target.values(), ...set.values()]);
    
                        }
    
                    }
    
                    case 'add': case 'delete': case 'clear': {
    
                        return function(...args) {
                
                            hook(target[property].bind(target), args);
    
                        }
    
                    }
    
                    default: {
    
                        return typeof target[property] === "function" ? target[property].bind(target) : target[property];
    
                    }
                }

            }

            if(target instanceof Map || target instanceof WeakMap) {

                switch (property) {
    
                    case 'set': case 'delete': case 'clear': {
    
                        return function(...args) {
            
                            hook(target[property].bind(target), args);
    
                        }
    
                    }
    
                    default: {
    
                        return typeof target[property] === "function" ? target[property].bind(target) : target[property];
    
                    }
                }

            }

            if(target instanceof Array) {

                switch (property) {
    
                    case 'concat': case 'push': case 'pop': case 'unshift': case 'shift': case 'splice': case 'sort': case 'reverse': {
    
                        return function(...args) {
                            
                            hook(target[property].bind(target), args);

                        }
    
                    }
    
                    default: {
    
                        return typeof target[property] === "function" ? target[property].bind(target) : target[property];
    
                    }
                }

            }

            return typeof target[property] === "function" ? target[property].bind(target) : target[property];

        },

        set(target, property, value) {

            if(target[property] !== value) {

                hook(Reflect.set, false, target, property, value);

            }

            return true;

        },

        deleteProperty(target, property) {

            hook(Reflect.deleteProperty, false, target, property);

            return true;

        }

    });

}