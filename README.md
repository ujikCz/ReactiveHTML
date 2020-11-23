# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download

src  
 └── ReactiveHTML.min.js
 
 ## Compatibility   
 Only browsers that supports ES6 (classes, proxies)   
  
 ## Hello world
 ```
 /* this example is create with htm.js */
 const { Render, CreateElement, Await } = ReactiveHTML;
 const html = htm.bind(CreateElement);
 
 Await('#app', el => Render(html`<div>Hello, world!</div>`));
 
 ```

### Updates
#### update 01
Changes: inside component you can call ```this.SetValue(target: Object, value: Object): Object``` that assigns value to target and make element reactive to that value, target is not going to be proxy.  
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

#### update 02
1. ```target = this.SetValue(value: any): any``` that assigns value to target and make it reactive for that assigments, target is not going to be proxy object.
2. style attribute expecting now object with styles, not string  
Example: 
```
html`<div style="${ { color: "red" } }">Hello, world!</div>`
```
that makes div color red, this update is for better manipuation with styles and not recalculations whole styles in DOM, but only changes
3. Render now can't render array of virtual nodes or components, but only one

