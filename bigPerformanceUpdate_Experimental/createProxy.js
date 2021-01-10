

export default function createProxy(object, bundle) {

    const proxy = new Proxy(object, {

        get(target, prop) {

            return Reflect.get(target, prop);

        },

        set(target, prop, value) {
            
            if(bundle === false) return true;

            bundle.push(function() {

                return Reflect.set(target, prop, value);

            });

            return true;

        },

        deleteProperty(target, prop) {

            if(bundle === false) return true;

            bundle.push(function() {

                return Reflect.deleteProperty(target, prop);

            });

            return true;

        }

    });

    return bundle !== false ? [proxy, bundle] : proxy;

}