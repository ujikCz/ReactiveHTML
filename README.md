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

### Issues
Issue 01: render renders only components, no not component elements (solved)
