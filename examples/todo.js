const html = htm.bind(ReactiveHTML.createElement);

/*
  Simple todo app using htm.js in combination with ReactiveHTML
*/

let id = 0;
class Todo extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {
            todos: []
        };  

        this.inputValue;

        this.handleInput = this.handleInput.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }   

    handleInput(e) {

        this.inputValue = e.target.value;
        e.target.value = '';

    }

    handleAdd(e) {

        if(this.inputValue) {

            this.setState({
                todos: [...this.states.todos, { value: this.inputValue, id: id++ }]
            });

            this.inputValue = null;

        }

    }

    handleRemove(item) {
        
        const todos = [...this.states.todos];
        const index = todos.indexOf(item);

        todos.splice(index, 1)

        this.setState({
            todos
        });

    }

    Element() {
        
        return (html`
            <div>
                <div class=todos-list>
                    ${ this.states.todos.map(item => {
                        return html`<div _key=${ item.id }>
                            <div style=${{ display: "inline" }}>${ item.value }</div>
                            <button onclick=${ e => this.handleRemove(item) }>remove</button>
                        </div>`
                    }) }    
                </div>

                <input type="text" onchange=${ this.handleInput } placeholder=value />
                <button onclick=${ this.handleAdd }>add</button>

            </div>`);
    }

}
