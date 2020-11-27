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
 
 Await('#app', el => Render(html`<div>Hello, world!</div>`, el));
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
 
 ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent()`, el));
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
 
 ReactiveHTML.Await('#app', el => ReactiveHTML.Render(new myComponent({ num: 0 })`, el));
 ```

 ### Hooks
 ```
 /*
  example is created with destructing assigment
 */
 
 const [hook, setHook, hookEffect] = new Hook(1);
 
 setHook(5);
 console.log(hook.value); //5
 
 hookEffect.push(MyComponent); //class: Class
 
 setHook(hook.value * 3); //MyComponent will react on this change

 ```


