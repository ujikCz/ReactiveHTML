        
/*
  !observable_module(!1);
*/        

        class Observable {

            constructor(resolutionFunc) {

                this.resolutionFunc = resolutionFunc;

                return this;

            }

            subscribe(setter) {

                if (typeof setter !== 'function') return this;

                Object.getPrototypeOf(setter).assign = function (assignNewValue) {

                    return this(assignNewValue);

                }

                this.resolutionFunc.apply(this, [setter]);

            }

        }

        const gg = new Observable(function (sub) {
            setInterval(function(){
                sub.assign(Math.random());
            }, 1000);

        });

        gg.subscribe(a => {

            console.log("a", a);

        });

        gg.subscribe(b => {

            console.log("b", b);

        });
