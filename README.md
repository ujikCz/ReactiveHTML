# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download
```
npm i reactivehtml

<script scr="https://cdn.jsdelivr.net/npm/reactivehtml@2.3.3/src/ReactiveHTML.min.js"></script>
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
All browsers that supports ES5 (IE 10 and higher, Chrome 23 and higher, Firefox 21 and higher)

## About
This library allows you to write components with html elements in javascript, so you can create conditional rendering or
list rendering simply.

The library has reactive state management, that means elements can react on your input (variables) and you don't have to
use dom api over your application.

Every change in components are done in virtual dom.

Virtual dom is lightweight copy of real dom, virtual dom is json javascript object, that means every diffing are faster
than in real dom, because real dom need to recalculate styles, parents,... 

The library is much faster than React, Vue and Angular (benchmarks will be added).

![benchmark](benchmark/bench.png)

This library is also very lightweight, only 2Kb min+gzip

## Special thanks :heart:
Jáchym Janoušek https://github.com/jachymjanousek    
Jan Turoň https://github.com/janturon    

## defer script
I highly recommend to create your scripts with ReactiveHTML with defer attribute, that script is parsed asynchronnaly with your html parsing and it is evaluated after html document is ready, but before DOMContentLoaded event, so you can manipulate with your elements and don't stop your main thread with html parsing.

```
<script src="ReactiveHTML.min.js"></script>
<script defer>

    //your script here....

</script>
```

## Hello world
```
/* this example is create with htm.js */
const html = htm.bind(ReactiveHTML.createElement);

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<div>Hello, world!</div>`, el));
```

note: every example are done with htm.js for clarity

## render method
This method render virtual dom into real dom and mount it to specific element.

```
ReactiveHTML.render(html`<div>Hello, world!</div>`, document.getElementById('app'));
```

## createElement method
This method creates virtual element.
It has 3 parameters, first one is String or Class of component. It defining type of virtual element.
Second parameter is Object that are props/attributes.
The last one is unlimited parameter. In this parameter can be children virtual nodes.

This method can be replaced with html literal string tag function.

```
ReactiveHTML.createElement('div', { id: "hello-world" }, 'Hello, world!');
html`<div id="hello-world">Hello, world!</div>`
```

This two virtual Elements are the same.

To make html function you have to installed htm.js library and bind its function to ReactiveHTML.createElement

```
const html = htm.bind(ReactiveHTML.createElement);
```

## createFactory method
This method creates fuction which can be called as component element.
This method has one parameter that is the component class.
On call factory function the first parameter is Object - props of component.

```
class myComponent extends ReactiveHTML.Component {

    Element() {

        return html`<div>${ this.props.message }</div>`

    }

}

const myComponentFactory = ReactiveHTML.createFactory(myComponent);

ReactiveHTML.render(myComponentFactory({ message: "Hello, world!" }), document.getElementById('app'));

```

## memo method
This method is for better performance in your app.
If this used on any virtual node or component, this component or virtual node will never update its children and attributes, props and states.

So if we have static virtual nodes or static components, this feature is very handy.
Your app will be better optimized and faster.
```
ReactiveHTML.memo(html`<div>Hello, world!</div>`);
```

## Components

### Element method
Element method is the only one method, that have to be defined else it will throw Error.

### Simple component

this example with component has the same output as the Hello world example, but with component based elements

```
class HelloWorldComponent extends ReactiveHTML.Component {

    Element() {

        return html`<div>Hello, world!</div>`

    }

}

ReactiveHTML.render(html`<${ HelloWorldComponent } />`, document.getElementById('app'));
```

### Component Factory
if you don't like element based component write, you can create factory of class and you can use component as function

```
const HelloWorldComponent = ReactiveHTML.createFactory(class extends ReactiveHTML.Component {

    Element() {

        return html`<div>Hello, world!</div>`

    }

});

ReactiveHTML.render(html`<${ HelloWorldComponent } />`, document.getElementById('app'));
```

### Component with props
props is object that should be read-only, it is for add child components some data from parent components

```
class HelloWorldComponent extends ReactiveHTML.Component {

    Element() {

        return html`<div>${ this.props.message }</div>`

    }

}

ReactiveHTML.render(html`<${ List } />`, document.getElementById('app'));
```

### Factory funciton with props
if you are using factory function as your component, your first parameter are props
```
const HelloWorldComponent = ReactiveHTML.createFactory(class extends ReactiveHTML.Component {

    Element() {

        return html`<div>${ this.props.message }</div>`

    }

});

ReactiveHTML.render(html`<${ List } />`, document.getElementById('app'));
```

### Component with states
States is simple object.
States are internally only in component where they was created.
You can create only one state object.

```
class Counter extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {
            count: this.props.count
        };

    }

    Element() {

        return html`<button onclick=${ (e) => this.setState(() => this.states.count++) }>${ this.states.count }</button>`

    }

});

ReactiveHTML.render(html`<${ Counter } />`, document.getElementById('app'));
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

ReactiveHTML.render(html`<${ Welcome } />`, document.getElementById('app'));
```

### List rendering
List rendering is also simple, you can use any array of virtual node elements you want.
If you want to create some simple list, you can use (map) method on array you want to display in list.

Remember that you can return only one element, so you have to add list into some container.

Every list element have to some identifier, you can add it by add :key attribute (in elements) or :key prop (in components), keys helps to recognize changes in elements. Every key has to be unique in list. It can be String, Number, but no Object, Function or Array.

```
class List extends ReactiveHTML.Component {

    constructor(props) {
        
        super(props);

        this.states = {
            products: ["Milk", "Butter", "Chesse", "Water"]
        };

        setTimeout(() => this.setState(() => this.states.products.push("Sugar")), 2500);

    }

    Element() {

        return html`<ul>${ this.states.products.map(product => html`<li :key=${ product }>${ product }</li>`) }</ul>`

    }

}

ReactiveHTML.render(html`<${ List } />`, document.getElementById('app'));
```

### List rendering with flatMap

Every list of items have to have some element container or you can use flatMap to iterate over array in array.

```
class List extends ReactiveHTML.Component {

    constructor(props) {
        
        super(props);

        this.states = {
            products: [["Milk", "Butter"], ["Chesse", "Water"]]
        };

        setTimeout(() => this.setState(() => this.states.products.push(["Lemon"])), 2500);

    }

    Element() {

    return html`
    <ul>
        ${ this.states.products.flatMap(container => container.map(product => html`<li :key=${ product }>${ product }</li>`)) }
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

    Element() {

        return html`<button onclick=${ this.props.add }>${ this.props.count }</button>`

    }

}

class parent extends ReactiveHTML.Component {

    super(props);

    constructor(props) {

        this.states = {
            count: 0
        };

        this.add = this.add.bind(this);

    }

    add() {

        this.setState(() => this.states.count++);

    }

    Element() {

        return html`<h2><${ child } add=${ this.add } count=${ this.states.count } /></h2>`

    }

}

ReactiveHTML.render(html`<${ parent } />`, document.getElementById('app'));
```

### Attributes
Attributes has same syntax as in HTML but you don't have to specify quotes on single values (no space).
Dynamic attributes are same as static, but you have tu use template syntax.
```
class AttributesTest extends ReactiveHTML.Component {

    Element() {

        return html`<div id=test class="t e s t" data-rand=${ Math.random() }></div>`

    }

}

ReactiveHTML.render(html`<${ AttributesTest } />`, document.getElementById('app'));
```

### Events
Events are attribute based.
Event listener executes your function in event.
Events can be custom, e.g. custom event "swipe" will be onswipe.
```
class EventTest extends ReactiveHTML.Component {

    Element() {

        return html`<button onclick=${ (e) => console.log(e.target.value) } value=secret>Click me</button>`

    }

}

ReactiveHTML.render(html`<${ EventTest } />`, document.getElementById('app'));
```

### Styles
Styles are objects with camelCase syntax vs regular css hyp-hens. 
```
class StylesTest extends ReactiveHTML.Component {

    Element() {

        return html`<div style=${{ backgroundColor: "red" }}>I am red</div>`

    }

}

ReactiveHTML.render(html`<${ StylesTest } />`, document.getElementById('app'));
```

### Lifecycles

Lifecycles are method of component. 
Lifecycles are triggered when something happen, e.g. onComponentRender trigger when component was rendered. 

There are 4 types of Lifecycles ```[manage lifecycles, callback lifecycles, future callback lifecycles, snapshot lifecycles]```

1. Manage lifecycles can manage behavior of component
2. Callback lifecycles are triggered when something happen with component
3. Future callback lifecycles are triggered before something happen with component
4. Snapshot lifecycles are for handle old values of props and states of component

#### Manage lifecycles
componentShouldUpdate lifecycle is manage method for better performance.
Return type is Boolean false means component will not update, true component will update.

How you can see in example, on every states change, component will react, but update only every two seconds - only if a changed.
This method is only for performance boost.

```
class ManageLifecyclesTest extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {

            a: 1

        };


        setInterval( () => {

            this.setState(() => this.states.a++);

        }, 1000);

    }

    shouldComponentUpdate() {

        return false;

    }

    onComponentUpdate() {

        console.log("update"); //this will not log

    }   

    Element() {

        return html`<div>${ this.states.a }</div>`

    }

}

ReactiveHTML.render(html`<${ ManageLifecyclesTest } />`, document.getElementById('app'));
```

#### Callback lifecycles
Callback lifecycles are methods which is called when something happen with component.

```
class CallbackLifecyclesTest extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        console.log("init"); // called only once per component used

    } 

    onComponentUpdate() {

        console.log("update"); // called on every update. Called after component is updated.

    }  

    onComponentCancelUpdate() {

        console.log("cancel update"); // called on every canceled update, this react on componentShouldUpdate

    }    

    onComponentRender(element) {

        console.log("render", element); // called once per component used. Called after component is rendered

    }  

    onComponentMount(element) {

        console.log("mount", element); // called after component is mounted

    }

    onComponenUntMount() {

        console.log("unmount"); // called after component is unmounted (removed from DOM tree)

    }

    Element() {

        return html`<div>Hello, world!</div>`

    }

}

ReactiveHTML.render(html`<${ CallbackLifecyclesTest } />`, document.getElementById('app'));
```

#### Future callback lifecycles
Future callback lifecycles are methods which is called when something will happen with component.

```
class FutureCallbackLifecyclesTest extends ReactiveHTML.Component {

    onComponentWillUpdate() {

        console.log("will update"); // called before every update. If update canceled by componentShouldUpdate, this will not called

    }   

    onComponentWillRender() {

        console.log("will render"); // called once per component used. Called before component is rendered

    }  

    onComponentWillMount() {

        console.log("will mount"); // called once per component used. Called before component is mounted to view

    }  

    onComponentWillUnMount() {

        console.log("will unmount"); // called before component will unmount (representing element will be removed from DOM tree)

    }  

    Element(props, states) {

        return html`<div>Hello, world!</div>`

    }

}

ReactiveHTML.render(html`<${ FutureCallbackLifecyclesTest } />`, document.getElementById('app'));
```

#### Snapshot lifecycles

```
class SnapshotLifecyclesTest extends ReactiveHTML.Component {

    getSnapshotBeforeUpdate() {

        console.log("snapshot"); //this snapshot is given before component update, so you can manipulate your data exactly before update

    } 

    Element() {

        return html`<div>Hello, world!</div>`

    }

}

ReactiveHTML.render(html`<${ SnapshotLifecyclesTest } />`, document.getElementById('app'));
```

### Component methods
Components have some methods that can manipulate with component.

#### Component.setState
This method expecting one parameter that is function.
In this function you can set your states, component will react on that changes.
```
class reactiveTest extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {

            count: 0

        };
    }

    Element() {

        return html`<button onclick=${ (e) => this.setState(() => this.states.count++) }>${ this.states.count }</button>`

    }

}

ReactiveHTML.render(html`<${ reactiveTest } />`, document.getElementById('app'));
```

