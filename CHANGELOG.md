### Change log

```this.setValue(:assigments): undefinded``` arguments in setValue function are assigments, on that assigments element can react   
#### hooks v 1.0.5
```const [hook, setHook, effectHook] = new ReactiveHTML.Hook(1);``` creates hook, on that hook can react more components at the same time   
```hook.value``` is value of hook   
```setHook(any: any): any``` set value of hook, components in effectHook array can react on this change   
```effectHook: Array``` there are all components you want to react on changes of hook, you can push or splice components   
if components is removed from effectHook, it will no longer respond on changes until you will add it back   

#### lifecycles v 1.0.6

```
class myComponent extends ReactiveHTML.Component {
  constructor(props){
    super(props);
  }
  
  onVnodeCreated() {
    console.log(this);
  }
  
  onVnodeUpdated() {
    console.log(this);
  }
  
  onComponentRendered() {
    console.log(this);
  }
  
  onComponentMounted() {
    console.log(this);
  }
  
  Element(props){
    return html`<div>Hello, world!</div>`
  }
}
```

#### value attribute v 1.0.6
value attribute now on update component set value attribute and value property on element

#### hooks v 1.0.7
hooks are now array with object and setter function   
```
const [hook, setHook] = new ReactiveHTML.Hook(1);

setHook(5);

//hook.value === 5

//add component to that hook

hook.useHook(MyComponent: Class, ...): Hook;

//remove component to that hook

hook.removeHook(MyComponent: Class, ...): Hook;

```

#### hooks v 1.0.8
added hookOn and unHook method
```
const [hook, setHook] = new ReactiveHTML.Hook(1);

setHook(5);

//hook.value === 5

//add component to that hook

hook.hookOn(MyComponent: Class, ...): Hook;

//remove component to that hook

hook.unHook(MyComponent: Class, ...): Hook;

```

#### lifecycles v 1.0.8

```
class myComponent extends ReactiveHTML.Component {
  constructor(props){
    super(props);
  }
  
  //changed names of lifecycles
  
  onComponentCreate() {
    console.log(this);
  }
  
  onComponentUpdate() {
    console.log(this);
  }
  
  onComponentRender() {
    console.log(this);
  }
  
  onComponentMount() {
    console.log(this);
  }
  
  //new lifecycles
  
  onComponentHook() {
    console.log(this);
  }
  
  onComponentUnHook() {
    console.log(this);
  }
  
  Element(props){
    return html`<div>Hello, world!</div>`
  }
}
```

#### Dispatcher v 1.0.9
dispatcher is element on website that is dispatcher of component   
first parameter is string that is element tag name on website and second is component class
```

new ReactiveHTML.Dispatcher("dispatchComponent", MyComponent);

<dispatchComponent></dispatchComponent>

```   
this element is now MyComponent and has its reactivity


#### Dispatcher with props v 1.0.9
to create dispatcher element with props add props to element attributes   
```

<dispatchComponent start="5" stop="10" array="[1, 2, 3]" object="{ time: new Date() }" func="function(){ alert("Hello"); }"></dispatchComponent>

```
props object in component class has now that values and of course it is reactive

#### removed this.setValue method v 1.0.9

#### fixed issues v 1.1.0

#### added self in global factory function v 1.1.1

#### added Observables v 1.1.1

observe primitives and trigger changes in virtual node

```
const observe = new ReactiveHTML.Observable(function(subscriber){
  
    subscriber.assign(5);
  
});

observe.subscribe(function(value){

    console.log(value); //5
  
});

observe.effect(component: Class);
```




