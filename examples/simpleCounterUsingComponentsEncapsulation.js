        class BTN extends ReactiveHTML.Component {
            Element() {

                return ReactiveHTML.createElement('button', { onclick: this.props.handleClick }, this.props.count);

            }
        }

        
        class Counter extends ReactiveHTML.Component {

            constructor(props) {

                super(props); 

                this.states = {

                    count: 0

                }

                this.handleClick = this.handleClick.bind(this);

            }

            handleClick(e) {

                this.setState({
                    count: this.states.count + 1
                });

            }

            Element() {

                return ReactiveHTML.createElement(BTN, { handleClick: this.handleClick, count: this.states.count });

            }

        }
