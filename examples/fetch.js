        class Fetch extends ReactiveHTML.Component {

            constructor(props) {

                super(props);

                this.states = {
                    result: null
                };  

                fetch('https://www.anapioficeandfire.com/api/books').then(res => res.json()).then(res => {

                    this.setState({
                        result: res
                    });

                });
            }   



            Element() {
                
                if(this.states.result) {

                    return ReactiveHTML.createElement('table', { border: "1px" }, 
                        Object.entries(this.states.result).map(([key, item], index) => {

                            return ReactiveHTML.createElement('tr', null, 
                                ReactiveHTML.createElement('td', null, item.name)
                            );

                        })
                    );

                }

                return '';

            }

        }

        ReactiveHTML.render(ReactiveHTML.createElement(Fetch), document.getElementById('app'));

