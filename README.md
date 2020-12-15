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

 ## Compatibility   
 Only browsers that supports ES8 (classes, proxies, Object.entries, Object.values)   
 
 ## About
 This library allows you to write components with html elements in javascript, so you can create conditional rendering or list rendering simply.   
 The library has reactive state management, that means elements can react on your input (variables) and you don't have to use dom api over your application.    
 Every change in components are done in virtual dom.      
 Virtual dom is lightweight copy of real dom, virtual dom is json javascript object, that means every diffing are faster than in real dom, because real dom need to recalculate styles, parents,...    
 
 ## Hello world
 ```
 /* this example is create with htm.js */
 const html = htm.bind(ReactiveHTML.createElement);
 
 ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(html`<div>Hello, world!</div>`, el));
 ```
 
 ## Components
 ### Simple component
 ```
 /* this example is create with htm.js */

 const html = htm.bind(ReactiveHTML.createElement);
 
 class myComponent extends ReactiveHTML.Component {
   Element(props){
     return html`<div>Hello, world!</div>`
   }
 }
 
 ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(new myComponent, el));
 ```
 
 ### Component with props
 ```
 /* this example is create with htm.js */

 const html = htm.bind(ReactiveHTML.createElement);
 
 class myComponent extends ReactiveHTML.Component {

   onComponentInit(props) {

     setInterval(function(){
       props.num++;
     }, 1000);

   }
   
   Element(props){
     return html`<div>${ props.num }</div>`
   }
 }
 
 ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(new myComponent({ num: 0 }), el));
 ```

## Events

 ```
 const html = htm.bind(ReactiveHTML.createElement);
 
 class myComponent extends ReactiveHTML.Component {
   
   Element(props){
     return html`<div onclick=${ (e) => ++props.num }>${ props.num }</div>`
   }
 }
 
 ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(new myComponent({ num: 0 }), el));
 ```

 ## Attributes

 ```
 const html = htm.bind(ReactiveHTML.createElement);
 
class myComponent extends ReactiveHTML.Component {

  onComponentInit(props) {

    props.id = "StaticIdProp";

      setInterval(function () {
          props.color = Math.random() * 360;
          props.num++;
      }, 1000);

  }

  Element(props) {
      return html `<div id=${ props.id } style=${ { backgroundColor: `hsl(${ props.color }, 100%, 50%)` } }>${ props.num }</div>`
  }
}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(new myComponent({
  num: 0,
  color: 0
}), el));
  ```

## Conditional rendering

 ```
 const html = htm.bind(ReactiveHTML.createElement);
 
class myComponent extends ReactiveHTML.Component {

  onComponentInit(props) {

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

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(new myComponent({
  is: true
}), el));
  ```

## List rendering

 ```
 const html = htm.bind(ReactiveHTML.createElement);
 
class myComponent extends ReactiveHTML.Component {

  onComponentInit(props) {

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

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(new myComponent({
  arr: [1, 2, 3]
}), el));
  ```

## Component inside component

 ```
 const html = htm.bind(ReactiveHTML.createElement);
 
class Parent extends ReactiveHTML.Component {

  Element(props) {
      return html `
      <div>
        ${ new Child }
      </div>`
  }
}

class Child extends ReactiveHTML.Component {

  Element(props) {
      return html `
      <div>
        Hello, world!
      </div>`
  }
}

ReactiveHTML.elementReady('#app', el => ReactiveHTML.render(new Parent, el));
  ```
 
 ## Lifecycles
 ```
 const html = htm.bind(ReactiveHTML.createElement);
 
 class myComponent extends ReactiveHTML.Component {
   
   onParentComponentUpdate(props){
   
     console.log(props);
     /*
      trigger on each new instance of class, 
      that means if props of parent component changed, 
      this will trigger, but onComponentInit won't
    */
   
   }
   
   onComponentUpdate(props){
   
     console.log(props);
     //trigger on each update
   
   }
   
   onComponentRender(props){
   
     console.log(props);
     //trigger only if component render

   }
   
   onComponentMount(props){
   
     console.log(props);
     //trigger only if component mount
   
   }

   onComponentInit(props) {

     console.log(props);
     //trigger only on component init

   }
   
   Element(props){
     return html`<div>Hello, world!</div>`
   }
 }
 ```
## Dispatcher
### Dispatcher 
dispatcher is element in HTML that is dispatcher of component   
first parameter is string that is element tag name in HTML and second is component class   
the element will be replaced with component   
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

