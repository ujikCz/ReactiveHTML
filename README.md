
# Newest verion is in Kiq.js repository!

# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download
```
npm i reactivehtml

<script src="https://cdn.jsdelivr.net/npm/reactivehtml@2.4.0/src/ReactiveHTML.min.js"></script>
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
All browsers that supports ES5 (Chrome 23 and higher, Firefox 21 and higher) thanks babel

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

## Hello world
```
/* this example is create with htm.js */
const html = htm.bind(ReactiveHTML.createElement);

ReactiveHTML.render(html`<div>Hello, world!</div>`, document.getElementById('app'));
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

These two virtual Elements are the same.

To make html function you have to installed htm.js library and bind its function to ReactiveHTML.createElement

```
const html = htm.bind(ReactiveHTML.createElement);
```

## createFactory method
This method creates fuction which can be called as component element.
This method has one parameter that is the component class.
Factory function expect one parameter as props of Component. In default it is empty Object.

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
This method is optimalization method.
If you have virtual element that is static or never be updated, skip the update process of his attributes and children.

```
ReactiveHTML.memo(html`<div>Hello, world!</div>`);
```

## ref method
This method is for some additional actions to the DOM that cannot be done in virual dom like focus() or click() or some third-party library where you have to use DOM.
Ref match the element from virtual node and return it as real DOM that is displayed on web page.
Match is done by _ref attribute, it cannot be in component, _ref attribute can only be at virtual element.
Referencies should be private in each component, so I don't recommend to use refs among components.
Note: don't overuse refs, if you can, just do it with native way of ReactiveHTML, because refs are anti-pattern of ReactiveHTML.

You can use callback function inside ref(callback) that is fired exactly when the referenced element was rendered.
```
class Input extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.refTest = ReactiveHTML.ref();

    }

    onComponentRender() {

        console.log(this.refTest); //{ node: Element, resolved: true, _onresolve: function } - onresolve function should be called only by the library

        this.refTest.node.click(); //log 'clicked'
    }

    Element() {

        return html`<button type="text" _ref=${ this.refTest } onclick=${ () => console.log('clicked') }>click</button>`

    }

}
```

## Components

### Element method
Element method is the only one method, that have to be defined else it will throw Error.
You have to return virtual element in this method.
Cannot be return null or undefined, else it throw error.

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
Props is object that should be read-only.
Props are for pass data down from parent component to child component.
It is something like function argument.

```
class HelloWorldComponent extends ReactiveHTML.Component {

    Element() {

        return html`<div>${ this.props.message }</div>`

    }

}

ReactiveHTML.render(html`<${ HelloWorldComponent } message=${ "Hello world" } />`, document.getElementById('app'));
```

### Children props
Props can be also children of component, so you can create component with children inside.

```
class HelloWorldComponent extends ReactiveHTML.Component {

    Element() {

        return html`<div>${ this.props.children }</div>`

    }

}

ReactiveHTML.render(html`<${ HelloWorldComponent }> Hello world </>`, document.getElementById('app'));
```

### Factory function with props
If you are using factory function as your component, your first argument are props.
Rest of arguments are children in props.
```
const HelloWorldComponent = ReactiveHTML.createFactory(class extends ReactiveHTML.Component {

    Element() {

        return html`<div>${ this.props.message }</div>`

    }

});

ReactiveHTML.render(html`<${ HelloWorldComponent } />`, document.getElementById('app'));
```

### Component with states
States are internally and private in component where they was created.
Initial states should be defined as object, not in setState method.
setState is method that set new states and apply changes surgically to DOM.
setState can be only called when component is rendered, will mount or/and is mounted.

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

### componentWillReceiveProps
This lifecycle hook is called on child component when mounted parent component change state and changed state is passed to child component.
First parameter are nextProps object.
Because states are defined only in constructor that is called before component is going to render, states are not updated on props change.
This lifecycle is for setState that is specially overrided in this method, so setState don't call udpate again in component.

```

class Parent extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {
            count: this.props.count
        };

    }

    onComponentRender() {

        setInterval(() => {
            
            this.setState({
                count: ++this.states.count
            });

        }, 1000);

    }

    Element() {

        return html`<${ Child } count=${ this.states.count } />`

    }

});

class Child extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {
            count: this.props.count
        };

    }

    componentWillReceiveProps(nextProps) {

        if(this.states.count !== nextProps.count) {
            
            this.setState({
                count: nextProps.count
            });

        }

    }

    Element() {

        return html`<div>${ this.states.count }</div>`

    }

});

ReactiveHTML.render(html`<${ Parent } count=${ 5 }/>`, document.getElementById('app'));
```

### Conditional rendering
Conditional rendering is very easy in ReactiveHTML, you can simply do if statement, switch, ternary operator or whatever you want.
You can add isSignedIn as state and your component will react on changes automatically. 
Be careful to return every virtual nodes from Element method, else it cause error.

```
class Welcome extends ReactiveHTML.Component {

    Element() {

        if(this.props.isSignedIn) return html`<h5>Welcome back</h5>`;
        return html`<h3>You should sign in</h3>`;

    }

}

ReactiveHTML.render(html`<${ Welcome } isSignedIn=${ true }/>`, document.getElementById('app'));
```

### List rendering
List rendering is also simple, you can use any array of virtual node elements you want.
If you want to create some simple list, you can use (map) method on array you want to display in list.

Remember that you can return only one element, so you have to add list into some container.

Every list element have to some identifier, you can add it by add :key attribute (in elements) or :key prop (in components), keys helps to recognize changes in elements. Every key has to be unique in list. It can be String, Number, but no Object, Function or Array.

If _key is not used, it will cause warning message.

```
class List extends ReactiveHTML.Component {

    constructor(props) {
        
        super(props);

        this.states = {
            products: ["Milk", "Butter", "Chesse", "Water"]
        };

        setTimeout(() => this.setState({
            products: [...this.states.products, "Sugar"]
        }), 2500);

    }

    Element() {

        return html`<ul>${ this.states.products.map(product => html`<li _key=${ product }>${ product }</li>`) }</ul>`

    }

}

ReactiveHTML.render(html`<${ List } />`, document.getElementById('app'));
```

### Component inside another component

Any component can be used as child of another component. 
Components can share states by props, that means child component can manipulate with parent component as you can see in example. 

How you can see in the example every additional method like "add" method should be bind to this context in constructor.
If we use directly props in child component we don't have to use componentWillReceiveProps, because we don't have to update any state.
```
class child extends ReactiveHTML.Component {

    Element() {

        return html`<button onclick=${ this.props.add }>${ this.props.count }</button>`

    }

}

class parent extends ReactiveHTML.Component {


    constructor(props) {

        super(props);

        this.states = {
            count: 0
        };

        this.add = this.add.bind(this);

    }

    add() {

        this.setState({
            count: ++this.states.count
        });

    }

    Element() {

        return html`<h2><${ child } add=${ this.add } count=${ this.states.count } /></h2>`

    }

}

ReactiveHTML.render(html`<${ parent } />`, document.getElementById('app'));
```

### Attributes
Attributes has same syntax as DOM properties, that means class="test" is going to className="test" or 
data-question="how are you?" is going to be dataset=${{ question: "how are you?" }}
Dynamic attributes are same as static, but you have tu use template syntax.
```
class AttributesTest extends ReactiveHTML.Component {

    Element() {

        return html`<div id=test className="t e s t" dataset=${{ rand: Math.random() }}></div>`

    }

}

ReactiveHTML.render(html`<${ AttributesTest } />`, document.getElementById('app'));
```

### Events
Events are attribute based.
Event listener executes your function in event.
Events can be custom, e.g. custom event "swipe" will be onswipe.
Every events are added by simple addEventListener.
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
Styles has same syntax as dataset - attribute with object inside.
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
componentShouldUpdate lifecycle is manage method for optimize the component updates.
Return type is Boolean true means component will update, everything other means component will not update.
By default componentShouldUpdate return true.
How you can see in example, on every states change, component will react, but update only every two seconds - only if a changed.
This method is only for performance boost.

Another manage lifecycle is componentWillReceiveProps.
We talked about it above.

```
class ManageLifecyclesTest extends ReactiveHTML.Component {

    constructor(props) {

        super(props);

        this.states = {

            a: 1

        };

    }

    shouldComponentUpdate() {

        return false;

    }

    onComponentRender() {

        setInterval( () => {

            this.setState({
                a: ++this.states.a
            });

        }, 1000);

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

    onComponentMount(element, container) {

        console.log("mount", element, container); // called after component is mounted

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

    onComponentWillMount(element, container) {

        console.log("will mount", element, container); // called once per component used. Called before component is mounted to view

    }  

    onComponentWillUnMount() {

        console.log("will unmount"); // called before component will unmount (representing element will be removed from DOM tree)
        //there you can stop all asynchronnous funcitons that call setState for no memory leak.

    }  

    Element() {

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

        return {
            snapA: 1
        };  
    } 

    onComponentUpdate(snapshot) {

        console.log(snapshot); //snapshot can be used here

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
This method expecting one parameter that is Object or Function that returns object.
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

        return html`<button onclick=${ (e) => this.setState({ count: ++this.states.count }) }>${ this.states.count }</button>`

    }

}

ReactiveHTML.render(html`<${ reactiveTest } />`, document.getElementById('app'));
```

