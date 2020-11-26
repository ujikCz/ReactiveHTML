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



