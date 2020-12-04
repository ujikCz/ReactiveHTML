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
  
  onComponentRendered() {
    console.log(this);
  }
  
  onComponentMounted() {
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
