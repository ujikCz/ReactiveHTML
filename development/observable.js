        
/*
  !observable_module(!1);
*/        

class Observable {

            constructor(initvalue, resolutionFunc) {

                this.resolutionFunc = resolutionFunc;
                this.initValue = this.value = initvalue;
                this.disconnected = false;

                this.resolutionFunc.bind(this)(this.value, this.initValue, this.initValue);

                return this;

            }

            subscribe(newValue) {

                if(this.disconnected) return this;

                const valueBefore = this.value;
                this.value = newValue;
                this.resolutionFunc.bind(this)(this.value, valueBefore, this.initValue);

                return this;

            }

            disconnect(lastCallback) {

                this.disconnected = true;

                if(lastCallback === undefined || lastCallback === null) {
                    return this;
                }

                lastCallback.bind(this)(this.value, this.initValue);

                return this;

            }

        }

        let a, b;
        const gg = new Observable(8, function(state, before, init) {

            console.log("changed", state, before, init);

            a = state;
            b = state + 1;

        }); 
        
        gg.subscribe(10);
