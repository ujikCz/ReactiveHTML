# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download

 npm i reactivehtml
 
 ## Compatibility   
 Only browsers that supports ES6 (classes, proxies)   
 
 ## About
 This library allows you to write components with html elements in javascript, so you can create conditional rendering or list rendering simply.   
 Library has reactive state management, that means elements can react on your input (variables) and you don't have to use dom api over your application which is very slow.    
 Every changes in components are done with virtual dom.    
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
     
     setInterval(function(){
       this.props.num++;
     }, 1000);
   }
   
   Element(props){
     return html`<div>${ props.num }</div>`
   }
 }
 
 ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent({ num: 0 }), el));
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

to create dispatcher element with props add props to element attributes   
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

observe.effect(component: Class);
```

value is now reactive and components will react on value changes

