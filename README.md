# ReactiveHTML
Simple reactive Virtual DOM elements for building complex reactive UI

### ReactiveHTML is simple and powerful
To create new reactiveHTML simple call its class.

```

const scope = new reactiveHTML({});

```

## data
To apply data to our reactiveHTML add it as object as first parameter of constructor

```

const scope = new reactiveHTML({
  myData: true
});

```

This scope variable has access to reactiveHTML methods.

## methods:
### Element

```

const myFirstReactiveElement = scope.Element(f => `hello world`);

```

That method has one function parameter.
Element method return virtual DOM (object copy of real DOM).
In callback function in Element has one parameter (f in our case), that has access to our data from constructor.

So, to create an element with our data you can do simple like that:

```

const myFirstReactiveElementWithData = scope.Element(f => `<div>${ f.myData }</div>`);

```

That creates this element: 

```

<div>true</div>

```

### Render

Render method render our virtual DOM to our page.

First parameter is virtual DOM and the second is a real DOM from page.

```

scope.Render(
  myFirstReactiveElementWithData, 
  document.getElementById('someId')
);

```




