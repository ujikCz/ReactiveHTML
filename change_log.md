### Change log

```this.setValue(:assigments): undefinded``` arguments in setValue function are assigments, on that assigments element can react   
#### hooks
```const hook = new ReactiveHTML.Hook(1);``` creates hook, on that hook can react more components in time   
```hook.effect.add(class: Class, ...): Array``` adds class (or more classes), if hook value was changed, components react on it    
```hook.effect.remove(class: Class, ...): Array``` removes class (or more classes), component won't react on this hook anytime until you add that component back   
```hook.value: any``` there is stored the hook value   
```hook.setValue(any: any): any``` set value of hook   

