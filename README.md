# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download
```
npm i reactivehtml
```

## HTM.js cdn
```
https://cdnjs.com/libraries/htm
```

## lit html
I also recommend to install lit html extension in visual studio code to highlight your elements inside string
```
bierner.lit-html
```

## Compatibility
Only browsers that supports ES8 (classes, proxies, Object.entries, Object.values)

## About
This library allows you to write components with html elements in javascript, so you can create conditional rendering or
list rendering simply.
The library has reactive state management, that means elements can react on your input (variables) and you don't have to
use dom api over your application.
Every change in components are done in virtual dom.
Virtual dom is lightweight copy of real dom, virtual dom is json javascript object, that means every diffing are faster
than in real dom, because real dom need to recalculate styles, parents,...

## Hello world
```
/* this example is create with htm.js */
const html = htm.bind(ReactiveHTML.createElement);

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<div>Hello, world!</div>`, el));
```

note: every example are done with htm.js for clarity

## Components
### Simple component

this example with component has the same output as the Hello world example, but with component based elements

```
class HelloWorldComponent extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<div>Hello, world!</div>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ HelloWorldComponent } />`, el));
```

### Component Factory
if you don't like element based component write, you can create factory of class and you can use component as function

```
const HelloWorldComponent = ReactiveHTML.createFactory(class extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<div>Hello, world!</div>`

    }

});

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(HelloWorldComponent(), el));
```

### Component with props
props is object that should be read-only, it is for add child components some data from parent components

```
class HelloWorldComponent extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<div>${ props.message }</div>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ HelloWorldComponent } message=${ "Hello, world!" }/>`, el));
```

### Factory funciton with props
if you are using factory function as your component, your first parameter are props
```
const HelloWorldComponent = ReactiveHTML.createFactory(class extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<div>${ props.message }</div>`

    }

});

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(HelloWorldComponent({ message: "Hello, world!" }), el));
```

### Component with states
States is reactive object, on every change done in this object, component will react.
States can be added by setStates method, setStates method should be executed only once to prevent bugs.
States are internally only in component where they was created.
```
class HelloWorldComponent extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.setStates({
            count: this.props.count
        });

    }

    Element(props, states) {

        return html`<button onclick=${ (e) => states.count++ }>${ states.count }</button>`

    }

});

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ HelloWorldComponent } count=${ 3 }/>`, el));
```

### Conditional rendering
Conditional rendering is very easy in ReactiveHTML, you can simply do if statement, switch, ternary operator or whatever you want.
You can add isSignedIn as state and your component will react on changes automatically. 
```
class Welcome extends ReactiveHTML.Component {

    Element(props, states) {

        if(props.isSignedIn) return html`<h5>Welcome back</h5>`;
        return html`<h3>You should sign in</h3>`;

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ Welcome } isSignedIn=${ true }/>`, el));
```

### List rendering
List rendering is also simple, you can use any array of virtual node elements you want.
If you want to create some simple list, you can use (map) method on array you want to display in list.

Remember that you can return only one element, so you have to add list into some container.

Static lists don't have to use :key inside elements, dynamic have. 

Every list element have to some identifier, you can add it by add :key attribute (in elements) or :key prop (in components), keys helps to recognize changes in elements. Every key has to be unique in list. It can be String, Number, but no Object, Function or Array.

```
class List extends ReactiveHTML.Component {

    constructor(props) {
        
        super(props);

        this.setStates({
            products: ["Milk", "Butter", "Chesse", "Water"]
        });

        setTimeout(() => this.states.products.push("Sugar"), 2500);

    }

    Element(props, states) {

        return html`<ul>${ states.products.map(product => html`<li :key=${ product }>${ product }</li>`) }</ul>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ List } />`, el));
```

### List rendering with flatMap

Every list of items have to have some element container or you can use flatMap to iterate over array in array.

```
class List extends ReactiveHTML.Component {

    constructor(props) {
        
        super(props);

        this.setStates({
            products: [["Milk", "Butter"], ["Chesse", "Water"]]
        });

        setTimeout(() => this.states.products.push(["Lemon"]), 2500);

    }

    Element(props, states) {

    return html`
    <ul>
        ${ states.products.flatMap(container => container.map(product => html`<li :key=${ product }>${ product }</li>`)) }
    </ul>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ List } />`, el));
```

### Component inside another component

Any component can be used as child of another component. 
Components can share states by props, that means child component can manipulate with parent component as you can see in example. 

```
class child extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<button onclick=${ props.add }>${ props.count }</button>`

    }

}

class parent extends ReactiveHTML.Component {

    super(props);

    constructor(props) {

        this.setStates({
            count: 0
        });

        this.add = this.add.bind(this);

    }

    add() {

        this.states.count++;

    }

    Element(props, states) {

        return html`<h2><${ child } add=${ this.add } count=${ states.count } /></h2>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ parent } />`, el));
```

### Attributes
Attributes has same syntax as in HTML but you don't have to specify quotes on single values (no space).
Dynamic attributes are same as static, but you have tu use template syntax.
```
class AttributesTest extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<div id=test class="t e s t" data-rand=${ Math.random() }></div>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ AttributesTest } />`, el));
```

### Events
Events are attribute based.
Event listener executes your function in event.
Events can be custom, e.g. custom event "swipe" will be onswipe.
```
class EventTest extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<button onclick=${ (e) => console.log(e.target.value) } value=secret>Click me</button>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ EventTest } />`, el));
```

### Styles
Styles are objects with camelCase syntax vs regular css hyp-hens. 
```
class StylesTest extends ReactiveHTML.Component {

    Element(props, states) {

        return html`<div style=${{ backgroundColor: "red" }}>I am red</div>`

    }

}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<${ StylesTest } />`, el));
```
