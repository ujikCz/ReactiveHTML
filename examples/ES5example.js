        /*
          this code is written in ES5 code, so IE11 is compatible with this code
          I don't recommend to use ES5 syntax but use ES6 class syntactic sugar
          If you want use classes and want to your code is compatible with IE11 I higly recommend to use transpiler like babel.js
        */
        
        function Counter(props) {

            ReactiveHTML.Component.call(this);

            this.states = {
                a: 0
            };

            setInterval(() => {

                this.setState({
                    a: this.states.a + 1
                });

            }, 1000);

            this.Element = function () {
                return ReactiveHTML.createElement('div', null, this.states.a);
            }

        }

        Todo.prototype = ReactiveHTML.Component.prototype;

        ReactiveHTML.render(ReactiveHTML.createElement(Counter), document.getElementById('app'));
