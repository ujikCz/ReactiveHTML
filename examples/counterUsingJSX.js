
/** @jsx ReactiveHTML.createElement */

/*
  this example is made with jsx pragma which is much better and clearer than htm or createElement function, I highly recommend use jsx 
  to use you have to install transpiler like babel.js and plugin with jsx
  note that @jsx in comment above, it is very important comment because it is pragma of jsx, we say to transpiler that jsx use to createElements function from ReactiveHTML library
  transpiling scripts is much faster than using htm.js, it is as fast as javascript function
*/

class Counter extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {

            count: 0

        };

        setInterval(() => {
            
            this.setState({
                count: this.states.count + 1
            });

        }, 1000);

    }


    Element() {

        return <div>{ this.states.count }</div>;

    }

}

ReactiveHTML.render(<Counter />, document.getElementById('app'))
