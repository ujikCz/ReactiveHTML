# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download
```
 npm i reactivehtml
 ```
 ## Compatibility   
 Only browsers that supports ES8 (classes, proxies, Object.entries)   
 
 ## About
 This library allows you to write components with html elements in javascript, so you can create conditional rendering or list rendering simply.   
 The library has reactive state management, that means elements can react on your input (variables) and you don't have to use dom api over your application.    
 Every change in components are done in virtual dom.      
 Virtual dom is lightweight copy of real dom, virtual dom is json javascript object, that means every diffing are faster than in real dom, because real dom need to recalculate styles, parents,...    
 
 ## Hello world
 ```
 /* this example is create with htm.js */
 const html = htm.bind(ReactiveHTML.CreateElement);
 
 ReactiveHTML.Await('#app', el => ReactiveHTML.Render(html`<div>Hello, world!</div>`, el));
 ```
 
 ## Components
 ### Simple component
 ```
 /* this example is create with htm.js */

 const html = htm.bind(ReactiveHTML.CreateElement);
 
 class myComponent extends ReactiveHTML.Component {
   constructor(props){
     super(props);
   }
   
   Element(props){
     return html`<div>Hello, world!</div>`
   }
 }
 
 ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent, el));
 ```
 
 ### Component with props
 ```
 /* this example is create with htm.js */

 const html = htm.bind(ReactiveHTML.CreateElement);
 
 class myComponent extends ReactiveHTML.Component {
   constructor(props){
     super(props);
     
     props = this.props;

     setInterval(function(){
       props.num++;
     }, 1000);
   }
   
   Element(props){
     return html`<div>${ props.num }</div>`
   }
 }
 
 ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent({ num: 0 }), el));
 ```

## Events

 ```
 const html = htm.bind(ReactiveHTML.CreateElement);
 
 class myComponent extends ReactiveHTML.Component {
   constructor(props){
     super(props);
   }
   
   Element(props){
     return html`<div onclick=${ (e) => ++this.props.num }>${ props.num }</div>`
   }
 }
 
 ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent({ num: 0 }), el));
 ```

 ## Attributes

 ```
 const html = htm.bind(ReactiveHTML.CreateElement);
 
class myComponent extends ReactiveHTML.Component {
  constructor(props) {

      props.id = "StaticIdProp";

      super(props);

      props = this.props;

      setInterval(function () {
          props.color = Math.random() * 360;
          props.num++;
      }, 1000);
  }

  Element(props) {
      return html `<div id=${ props.id } style=${ { backgroundColor: `hsl(${ props.color }, 100%, 50%)` } }>${ props.num }</div>`
  }
}

ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent({
  num: 0,
  color: 0
}), el));
  ```

## Conditional rendering

 ```
 const html = htm.bind(ReactiveHTML.CreateElement);
 
class myComponent extends ReactiveHTML.Component {
  constructor(props) {

      super(props);

      props = this.props;

      setInterval(function () {
          props.is = !props.is;
      }, 1000);
  }

  Element(props) {
      return html `
      <div>
        ${ props.is ? html`<h1>true</h1>` : html`<h6>false</h6>` }
      </div>`
  }
}

ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent({
  is: true
}), el));
  ```

## List rendering

 ```
 const html = htm.bind(ReactiveHTML.CreateElement);
 
class myComponent extends ReactiveHTML.Component {
  constructor(props) {

      super(props);

      props = this.props;

      setInterval(function () {
          props.arr.push(props.arr.length + 1);
      }, 1000);
  }

  Element(props) {
      return html `
      <div>
        ${ props.arr.map(mapped => html`<div>${ mapped }</div>`) }
      </div>`
  }
}

ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent({
  arr: [1, 2, 3]
}), el));
  ```

## Component inside component

 ```
 const html = htm.bind(ReactiveHTML.CreateElement);
 
class Parent extends ReactiveHTML.Component {
  constructor(props) {

      super(props);
  }

  Element(props) {
      return html `
      <div>
        ${ new Child }
      </div>`
  }
}

class Child extends ReactiveHTML.Component {
  constructor(props) {

      super(props);
  }

  Element(props) {
      return html `
      <div>
        Hello, world!
      </div>`
  }
}

ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new Parent, el));
  ```

 ## States
 States won't change do default value on parent rerender, props will 
 ```
 class myComponent extends ReactiveHTML.Component {
   constructor(props){
     super(props);
     
     console.log(this.states.num); //5
   }
   
   setStates(){
   
      return {
      
         num: 5
       
      }
     
   }
   
   Element(props, states){
     return html`<div>${ states.num }</div>`
   }
 }

 ```
## Dispatcher
### Dispatcher 
dispatcher is element on website that is dispatcher of component   
first parameter is string that is element tag name on website and second is component class
```

new ReactiveHTML.Dispatcher("dispatchComponent", MyComponent);

<dispatchComponent></dispatchComponent>

```   
this element is now MyComponent and has its reactivity   

### Dispatcher with props

to create dispatcher element with props add props as element attributes   
```

<dispatchComponent start="5" stop="10" array="[1, 2, 3]" object="{ time: new Date() }" func="function(){ alert("Hello"); }"></dispatchComponent>

```
props object in component class has now that values and of course it is reactive

### Observables

observe primitives and trigger changes in virtual node

```
let value = 0;
const observe = new ReactiveHTML.Observable(function(subscriber){
  
    subscriber.assign(5);
  
});

observe.subscribe(function(state){

    console.log(state); //5
    value = state;
  
});

observe.effect(component);
```

value is now reactive and components will react on value changes

