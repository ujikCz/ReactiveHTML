        /*
         *   observing and templating data
         */

        import getProto from './getProto.js';
        import updateVnodeAndRealDOM from './DOM/updateVnodeAndRealDOM.js';


        export default class Observable {

            constructor(subscriber) {

                if (typeof subscriber !== 'function') {

                    throw Error(`Observable subscriber must be function, your subscriber has value: ${ subscriber }`);

                }

                this.subscriber = subscriber;
                this.effectArray = new Set();

                return this;

            }

            subscribe(setter) {

                if (typeof setter !== 'function') return this;

                const componentEffectArr = this.effectArray;

                getProto(setter).assign = function (assignNewValue) {

                    this(assignNewValue);

                    componentEffectArr.forEach(component => {

                        updateVnodeAndRealDOM(component);

                    });

                    return this;

                }

                this.subscriber.apply(this, [setter]);

                return this;

            }

            effect(...components) {

                components.forEach(component => {

                    this.effectArray.add(component);

                });

                return this;

            }

        }