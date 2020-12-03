# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

## Download

src  
 └── ReactiveHTML.min.js
 
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

 ### Hooks
 ```
 /*
  example is created with destructing assigment
 */
 
 const [hook, setHook, hookEffect] = new ReactiveHTML.Hook(1);
 
 setHook(5);
 console.log(hook.value); //5
 
 hookEffect.push(MyComponent); //class: Class
 
 setHook(hook.value * 3); //MyComponent will react on this change

 ```


