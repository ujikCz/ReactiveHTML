# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download

src  
 └── ReactiveHTML.min.js
 
 ## Hello world
 ```
 /* this example is create with htm.js */
 const { Render, CreateElement, Await } = ReactiveHTML;
 const html = htm.bind(CreateElement);
 
 Await('#app', el => Render(html`<div>Hello, world!</div>`));
 
 ```
 
### Size comparison with other frameworks

ReactiveHTML.min.js = 3kB  
React.js (react + react-dom) = 109kB  
Preact.min.js = 4kB  
Vue.min.js = 33.30KB min+gzip  
Angular.js = 143kB  
  
### Issues
Issue 01: render renders only components, no not component elements (solved)

### Update
Changes: inside component you can call this.SetValue(target, value) that assign value to target and make element reactive to that value, target is not going to be proxy.  
Example: 
```
let obj = {};
class MyComponent extends ReactiveHTML.Component {

  constructor(props) {
    super(props);
  }
  
  Element(props) {
  
    return html`<div>${ obj.a }</div>`
  
  }

}

const component = new MyComponent();
component.SetValue(obj, { a: "hello world" });

//rendered element is <div>hello world</div>
```
