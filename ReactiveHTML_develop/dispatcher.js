 /*
  *   creates dispatcher that is static HTML element
  *   that element change to component immediately 
  */

 import onElementReady from './DOM/elementReady.js';

 export default class Dispatcher {

     constructor(elementTagName, component) {

         this.obs = onElementReady(elementTagName, function (el) {

             const dispatcherProps = {};

             /*
              *   convert all HTML element dispatcher attributes to prop (data)  
              */

             Array.from(el.attributes).forEach(attributeOfElementDispatcher => {

                 dispatcherProps[attributeOfElementDispatcher.nodeName] = new Function(`"use strict"; return(${ attributeOfElementDispatcher.nodeValue })`)();

             });

             return ReactiveHTML.render(new component(dispatcherProps), el, true);

         }, false, false);

     }

     disconnect() {

         return this.obs.disconnect();

     }

 }