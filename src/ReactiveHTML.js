
/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/
(function (global, factory) {

  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }
    return _typeof(obj);
  }

  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory(_typeof) : typeof define === 'function' && define.amd ? define(function(){ return factory(_typeof);}) : (global = global || self, global.ReactiveHTML = factory(_typeof));
})(void 0, function (_typeof) {
  "use strict";


  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }


  var alreadyWarned = [];

  function warn(message, id) {
    if (id !== undefined) {
      // if id is specified
      if (!alreadyWarned.includes(id)) {
        // if id is not already in alreadyWarned array
        alreadyWarned.push(id); //add id to alredyWarned array

        console.warn(message); //warn
      }
    } else {
      // if id is not specified warn every time function is called
      console.warn(message);
    }
  }

  function shedule(callback) {
    return window.requestAnimationFrame(callback);
  }

  function memo(virtualNode) {
    if (isComponent(virtualNode.type)) {
      warn("Memoizing Component will not affect Component from rerender, Component has lifecycle hook shouldComponentUpdate(nextProps, nextStates), which is used to decide if Component will udpate or not");
    } else {
      virtualNode._memo = true;
    }

    return virtualNode;
  }

  function isObject(object) {
    return _typeof(object) === 'object' && object !== null;
  }

  function isNullOrUndef(value) {
    return value === null || value === undefined;
  }

  function isFunction(func) {
    return typeof func === 'function';
  }

  function isComponent(type) {
    if (isFunction(type) && type.prototype.isReactiveHTMLComponent) return true;
    return false;
  }

  function isArray(array) {
    return Array.isArray(array);
  }

  var KEY_CHILDREN_WARN = 0;
  var NON_OBJECT_RETURNED_FROM_SET_STATE = 1;

  function createElement(type) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    /**
     * get the _key that is originally in props/attributes of virtual element
     */
    if (!type) {
      throw TypeError("createElement(...) type must be defined, it can be String that represent DOM tagName or Class/Funciton that represent Component");
    }

    var _key = null;
    var _ref = null;

    if (props !== null) {
      if (props._key !== undefined) {
        _key = props._key;
        delete props._key;
      }

      if (props._ref !== undefined) {
        _ref = props._ref;
        delete props._ref;
      }
    }

    props = props || {};
    /**
     * if element is component
     */

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key2 = 2; _key2 < _len; _key2++) {
      children[_key2 - 2] = arguments[_key2];
    }

    if (isComponent(type)) {
      /**
       * returning children as props we can create components like this:
       * <Component>${ 4 + 1 }</Component>
       * in this example our children prop is (5)
       */
      if (children.length) {
        props = _objectSpread({
          children: children
        }, props);
      }

      return {
        type: type,
        props: props,
        _key: _key
      };
    }

    if (isFunction(type) || !(typeof type === 'string' || type instanceof String)) {
      throw TypeError("createElement(...) type can be only Component or String as tag of Element");
    }
    /**
     * if element is basic virtual node element
     */


    return {
      type: type,
      attrs: props,
      children: children,
      _key: _key,
      _ref: _ref
    };
  }

  function assignNewPropsAndStates(oldComponent, nextProps, nextStates) {
    if (isObject(nextProps)) {
      Object.assign(oldComponent.props, nextProps);
    }

    if (isObject(nextStates)) {
      Object.assign(oldComponent.states, nextStates);
    }

    return oldComponent;
  }

  function Component(props) {
    this.props = props;
    this.states = {};
    this._internals = {
      realDOM: null,
      virtual: null
    };
    return this;
  }
  /**
   * Element method is the only one method that is required to be in component
   */


  Component.prototype.Element = function () {
    //not overrided Element method throws error cause Element must be defined in component
    throw Error("You have to specify Element method in your Component, Element must return virtual element");
  };
  /**
   * setState method for set new states of component and update it
   * real dom will react on state changes
   * @param { Object || Function } setter - set the new states of component
   */


  Component.prototype.setState = function (setter) {
    return setState(this, setter, false);
  };

  Component.prototype.onComponentRender = Component.prototype.onComponentWillUpdate = Component.prototype.onComponentUpdate = Component.prototype.onComponentWillMount = Component.prototype.onComponentMount = Component.prototype.onComponentCancelUpdate = Component.prototype.getSnapshotBeforeUpdate = Component.prototype.componentWillReceiveProps = Component.prototype.onComponentWillUnMount = function () {};
  /**
   * shouldComponentUpdate is used when component is going to udpate, this method is for better optimalization
   */


  Component.prototype.shouldComponentUpdate = function () {
    return true;
  };
  /**
   * for recognize ReactiveHTML component
   */


  Component.prototype.isReactiveHTMLComponent = true;
  /**
   * this function will trigger the update of component
   */

  function createComponentInstance(component) {
    var instance = new component.type(component.props);
    instance._internals.virtual = checkVirtual(instance.Element());
    instance._key = component._key;
    instance.type = component.type;
    return instance;
  }

  function checkVirtual(virtual) {
    if (isNullOrUndef(virtual)) {
      throw Error("Element cannot return undefined or null");
    }

    return virtual;
  }

  function setState(component, setter, setStateSyncPropsUpdate) {
    //setter can be object or function that returns object
    if (!component._internals.realDOM) {
      throw Error("setState(...) can be called only if component is rendered, will be mounted or is mounted");
    }

    if (isObject(setter) || isFunction(setter)) {
      setter = isFunction(setter) ? setter.bind(component)(component.props, component.states) : setter; //get the new states and save them in setter variable

      if (!isObject(setter) || Object.keys(setter).length === 0) {
        warn("setState(...) should be Object or Function that returns Object, if Object is empty or doesn't return nothing, update can be redundant", NON_OBJECT_RETURNED_FROM_SET_STATE);
      }

      if (!setStateSyncPropsUpdate) {
        var update = updateComponent(component, null, setter); //update component return patch which is function and snapshot that is given from getSnapshotBeforeUpdate

        if (update) {
          var _update = _slicedToArray(update, 2),
            patch = _update[0],
            snapshot = _update[1];

          var _patch = patch(component._internals.realDOM);

          var _patch2 = _slicedToArray(_patch, 2);

          component._internals.virtual = _patch2[0];
          component._internals.realDOM = _patch2[1];
          //patch the virtual dom and the real dom connected to component
          component.onComponentUpdate(snapshot); //call update lifecycle in the component
        }

        return component;
      }

      assignNewPropsAndStates(component, null, setter);
      return component;
    }

    throw TypeError("setState(...) expecting 1 parameter as Function or Object, you give ".concat(_typeof(setter)));
  }

  function getSnapshotBeforeUpdateLifecycle(component) {
    return component.getSnapshotBeforeUpdate() || null;
  }

  function mountLifecycle(component, container) {
    component.onComponentMount(component._internals.realDOM, container);
  }

  function renderLifecycle(component) {
    component.onComponentRender(component._internals.realDOM);
  }

  function willMountLifecycle(component, container) {
    component.onComponentWillMount(component._internals.realDOM, container);
  }

  var alreadyThrowedError = [];

  function willUnMount(component) {
    if (isObject(component)) {
      if (isComponent(component.type)) {
        component.onComponentWillUnMount(component._internals.realDOM);

        component.setState = function () {
          component.setState = function () {};

          var nameOfComponent = component.constructor.name;

          if (!alreadyThrowedError.includes(nameOfComponent)) {
            alreadyThrowedError.push(nameOfComponent);
            throw Error("Remove all asynchronnous functions that causes setState(...) of ".concat(nameOfComponent, " in onComponentWillUnMount, else it causes memory leak"));
          }
        };

        willUnMount(component._internals.virtual);
      } else {
        for (var i = 0; i < component.children.length; i++) {
          willUnMount(component.children[i]);
        }
      }
    }
  }

  function updateComponent(oldComponent, nextProps, nextStates) {
    /**
     * newComponent is plain javascript object { type, props, _key }
     * we use the new props that we can get updated from parent component
     */

    /**
     * should component update, if return false, component will be never updated
     */
    if (!oldComponent.shouldComponentUpdate(nextProps, nextStates)) {
      oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextStates);
      oldComponent.onComponentCancelUpdate();
      return false;
    }
    /**
     * if you want get the snapshot of component before update
     */


    var snapshot = getSnapshotBeforeUpdateLifecycle(oldComponent);
    /**
     * if should component update return true, component will be updated as normally
     */

    oldComponent = assignNewPropsAndStates(oldComponent, nextProps, nextStates);
    /**
     * instead of creating new instance of component, create only new virual element of component and diff it with old one
     */

    oldComponent.onComponentWillUpdate(snapshot);
    var newVNode = checkVirtual(oldComponent.Element());
    /**
     * using diffChildren we can manipulate with appendChild and insertBefore
     */

    return [diff(oldComponent._internals.virtual, newVNode), snapshot];
  }

  function createDomElement(vnode) {
    /**
     * create element
     */
    var el = document.createElement(vnode.type);
    /**
     * add attributes, but like element properties for easy manipulation
     */

    for (var key in vnode.attrs) {
      if (key.startsWith('on')) {
        var eventName = key.replace('on', '');
        el.addEventListener(eventName, vnode.attrs[key]);
      } else if (isObject(vnode.attrs[key])) {
        //cannot be null or undef cause isObject!!!
        Object.assign(el[key], vnode.attrs[key]);
      } else {
        if (!isNullOrUndef(vnode.attrs[key])) {
          if (key in el) {
            el[key] = vnode.attrs[key];
          } else {
            el.setAttribute(key, vnode.attrs[key]);
          }
        }
      }
    }
    /**
     * do everything again recursively for all children
     */


    if (vnode.children.length) {
      var childrenFrag = document.createDocumentFragment();

      for (var i = 0, children = vnode.children; i < children.length; i++) {
        var vNewNode = _render(children[i]);

        mount(vNewNode, childrenFrag, 'appendChild');

        if (vNewNode) {
          children[i] = applyToVirtualNode(vNewNode);
        }
      }

      el.appendChild(childrenFrag);
    }
    /**
     * return final element
     */


    return el;
  }

  function applyToVirtualNode(newNodeDefinition) {
    if (isArray(newNodeDefinition)) {
      return newNodeDefinition.map(function (siglenewNodeDefinition) {
        return siglenewNodeDefinition.virtualNode;
      });
    } else {
      return newNodeDefinition.virtualNode;
    }
  }

  function mount(newNodeDefinition, container, method) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key3 = 3; _key3 < _len2; _key3++) {
      args[_key3 - 3] = arguments[_key3];
    }

    if (isArray(newNodeDefinition)) {
      var listFrag = document.createDocumentFragment();
      newNodeDefinition = newNodeDefinition.map(function (singleNewNodeDefinition) {
        return mount.apply(void 0, [singleNewNodeDefinition, listFrag, method].concat(args));
      });
      return container.appendChild(listFrag);
    }

    var isComponentCache = isComponent(newNodeDefinition.virtualNode.type);

    if (newNodeDefinition.realDOM !== undefined) {
      //if rendered return no null value
      if (isComponentCache) {
        willMountLifecycle(newNodeDefinition.virtualNode, container);
      }

      container[method].apply(container, [newNodeDefinition.realDOM].concat(args));

      if (isComponentCache) {
        mountLifecycle(newNodeDefinition.virtualNode, container);
      }
    }

    return newNodeDefinition.realDOM;
  }

  function _render(virtualNode) {
    /**
     * if virtual dom is undefined return no dom object
     */
    if (isNullOrUndef(virtualNode)) {
      throw Error("virtual node cannot be null or undefined");
    }

    ;
    /**
     * return mapped array of dom object created from virtual elements
     */

    if (isArray(virtualNode)) {
      return virtualNode.map(function (singleVirtualNode) {
        return _render(singleVirtualNode);
      });
    }
    /**
     * create text nodes 
     */


    if (!isObject(virtualNode)) {
      //text node
      return {
        realDOM: document.createTextNode(virtualNode),
        virtualNode: virtualNode
      };
    }
    /**
     * create components and assign ref specifications
     */


    if (isComponent(virtualNode.type)) {
      virtualNode = createComponentInstance(virtualNode); //component

      var newNodeDefinition = _render(virtualNode._internals.virtual);

      virtualNode._internals = {
        realDOM: newNodeDefinition.realDOM,
        //assign final realDOM
        virtual: newNodeDefinition.virtualNode //assign created instance of virtual inside Element of component

      };
      /**
       * means if virtual is not element but component, it become Class.Component from {type, props, _key}
       * we must overwrite the virtal beacause of this
       */

      renderLifecycle(virtualNode);
      return {
        realDOM: newNodeDefinition.realDOM,
        virtualNode: virtualNode
      };
    }
    /**
     * creates basic elements
     */


    var newRealNode = createDomElement(virtualNode);

    if (virtualNode._ref) {
      Object.assign(virtualNode._ref, resolveRef(virtualNode._ref, newRealNode));

      if (virtualNode._ref._onresolve) {
        virtualNode._ref._onresolve(virtualNode._ref);
      }
    } //virtualNode


    return {
      realDOM: newRealNode,
      virtualNode: virtualNode
    };
  }

  function diff(vOldNode, vNewNode) {
    /**
     * cache all statements
     */
    var isVOldNodeObject = isObject(vOldNode);
    var isVNewNodeObject = isObject(vNewNode);
    var isVOldNodeComponent = isVOldNodeObject && isComponent(vOldNode.type);
    var isVNewNodeComponent = isVNewNodeObject && isComponent(vNewNode.type);
    /*
     *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
     */

    if (vNewNode === undefined) {
      return function (node) {
        willUnMount(vOldNode);
        shedule(function () {
          return node.remove();
        });
        return [undefined, undefined];
      };
    }

    if (isVOldNodeComponent || isVNewNodeComponent) {
      return diffComponents(vOldNode, vNewNode, isVOldNodeComponent, isVNewNodeComponent);
    }

    if (!isVOldNodeObject || !isVNewNodeObject) {
      return diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject);
    }
    /*
     *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
     */


    if (vOldNode.type !== vNewNode.type) {
      return function (node) {
        var newNodeDefinition = _render(vNewNode);

        shedule(function () {
          return mount(newNodeDefinition, node, 'replaceWith');
        });
        return [newNodeDefinition.virtualNode, newNodeDefinition.realDOM];
      };
    }

    return function (node) {
      if (vOldNode._memo) {
        return [vOldNode, node];
      }

      if (isObject(vOldNode.attrs) || isObject(vNewNode.attrs)) {
        var _diffAttrs = diffAttrs(vOldNode.attrs || {}, vNewNode.attrs || {})(node);

        var _diffAttrs2 = _slicedToArray(_diffAttrs, 2);

        vNewNode.attrs = _diffAttrs2[0];
        node = _diffAttrs2[1];
      }

      if (vOldNode.children.length + vNewNode.children.length > 0) {
        var _diffChildren = diffChildren(vOldNode.children, vNewNode.children)(node);

        var _diffChildren2 = _slicedToArray(_diffChildren, 2);

        vNewNode.children = _diffChildren2[0];
        node = _diffChildren2[1];
      }

      return [vNewNode, node];
    };
  }

  ;

  function diffAttrs(oldAttrs, newAttrs) {
    var attrsPatches = [];

    var _loop = function _loop(key) {
      if (key.startsWith('on')) {
        if (!(key in oldAttrs)) {
          // add event listeners
          attrsPatches.push(function (node) {
            node.addEventListener(key.replace('on', ''), newAttrs[key]);
            return node;
          });
        }
      } else if (isObject(newAttrs[key])) {
        // if is object set property by object assign
        attrsPatches.push(function (node) {
          Object.assign(node[key], newAttrs[key]);
          return node;
        });
      } else if (newAttrs[key] !== oldAttrs[key] || !(key in oldAttrs)) {
        attrsPatches.push(function (node) {
          if (isNullOrUndef(newAttrs[key])) {
            node.removeAttribute(key === 'className' ? 'class' : key);
            return node;
          }

          if (key in node) {
            node[key] = newAttrs[key];
            return node;
          }

          node.setAttribute(key, newAttrs[key]);
          return node;
        });
      }
    };

    for (var key in newAttrs) {
      _loop(key);
    } // remove old attributes


    var _loop2 = function _loop2(k) {
      if (!(k in newAttrs)) {
        if (k.startsWith('on')) {
          // is event, remove event listener
          attrsPatches.push(function (node) {
            node.removeEventListener(k.replace('on', ''), oldAttrs[k]);
            return node;
          });
        } else {
          // else remove attribute from element
          attrsPatches.push(function (node) {
            node.removeAttribute(k);
            return node;
          });
        }
      }
    };

    for (var k in oldAttrs) {
      _loop2(k);
    }

    return function (node) {
      for (var i = 0; i < attrsPatches.length; i++) {
        node = attrsPatches[i](node);
      }

      return [newAttrs, node];
    };
  }

  function diffComponents(oldComponent, newComponent, isVOldNodeComponent, isVNewNodeComponent) {
    /**
     * both new and old virutal nodes are components
     */
    if (isVOldNodeComponent && isVNewNodeComponent) {
      /**
       * if new and old components has the same type, update the old component
       */
      if (oldComponent.type === newComponent.type) {
        return function (node) {
          oldComponent.setState = function (setter) {
            return setState(oldComponent, setter, true); //setState don't rerender element in additional
          };

          oldComponent.componentWillReceiveProps(newComponent.props);

          oldComponent.setState = function (setter) {
            return setState(oldComponent, setter, false); //all synchronnous setState will cause only one rerender on update
          };
          /**
           * same as in component.js
           */


          var update = updateComponent(oldComponent, newComponent.props, null);

          if (update) {
            var _update2 = _slicedToArray(update, 2),
              patch = _update2[0],
              snapshot = _update2[1];

            var _patch3 = patch(node);

            var _patch4 = _slicedToArray(_patch3, 2);

            oldComponent._internals.virtual = _patch4[0];
            oldComponent._internals.realDOM = _patch4[1];
            oldComponent.onComponentUpdate(snapshot);
          }

          return [oldComponent, node];
        };
      }
      /**
       * if new component has another type than old component unmount old component and create new component
       */


      return function (node) {
        var vNewNodeInstance = createComponentInstance(newComponent);
        willUnMount(oldComponent);

        var _diff = diff(oldComponent._internals.virtual, vNewNodeInstance._internals.virtual)(node);

        var _diff2 = _slicedToArray(_diff, 2);

        vNewNodeInstance._internals.virtual = _diff2[0];
        vNewNodeInstance._internals.realDOM = _diff2[1];
        renderLifecycle(vNewNodeInstance);
        willMountLifecycle(vNewNodeInstance, node.parentNode);
        mountLifecycle(vNewNodeInstance, node.parentNode);
        return [vNewNodeInstance, node];
      };
    }
    /**
     * if old is component and new is not, unmount old component and return only virtual node (not component)
     */


    if (isVOldNodeComponent && !isVNewNodeComponent) {
      return function (node) {
        var patch = diff(oldComponent._internals.virtual, newComponent);

        var _patch5 = patch(node);

        var _patch6 = _slicedToArray(_patch5, 2);

        newComponent = _patch6[0];
        node = _patch6[1];
        willUnMount(oldComponent);
        return [newComponent, node];
      };
    }
    /**
     * if old virtual node is not component and new is, create instance of new component and replace it with the virtual node
     */


    return function (node) {
      var vNewNodeInstance = createComponentInstance(newComponent);

      var _diff3 = diff(oldComponent, vNewNodeInstance._internals.virtual)(node);

      var _diff4 = _slicedToArray(_diff3, 2);

      vNewNodeInstance._internals.virtual = _diff4[0];
      vNewNodeInstance._internals.realDOM = _diff4[1];
      renderLifecycle(vNewNodeInstance);
      willMountLifecycle(vNewNodeInstance, node.parentNode);
      mountLifecycle(vNewNodeInstance, node.parentNode);
      return [vNewNodeInstance, node];
    };
  }

  function diffChildren(oldVChildren, newVChildren, shouldBeKeyed) {
    /**
     * filterNull filter every null elements in array and remove it, so we can easily recognize which array is smaller or bigger
     */
    var childPatches = [];
    var additionalPatches = [];
    /**
     * loop throught all oldVChildren and diff matched elements
     */

    var _loop3 = function _loop3(i, l) {
      if (isArray(oldVChildren[i])) {
        additionalPatches.push(diffChildren(oldVChildren[i], newVChildren[i], true));
      } else {
        if (isObject(oldVChildren[i]) && oldVChildren[i]._key !== null) {
          childPatches.push(function (node) {
            var findedByKey = newVChildren.find(function (f) {
              return f._key === oldVChildren[i]._key;
            });
            var indexInNewVChildren = newVChildren.indexOf(findedByKey);

            var _diff5 = diff(oldVChildren[i], findedByKey)(node);

            var _diff6 = _slicedToArray(_diff5, 2);

            newVChildren[indexInNewVChildren] = _diff6[0];
            node = _diff6[1];
            return [newVChildren[indexInNewVChildren], node];
          });
        } else {
          if (shouldBeKeyed) {
            warn("Children inside array should be keyed by _key attribute/prop, if you don't key your elements, it can cause redundant rerender or bad rerender", KEY_CHILDREN_WARN);
          }

          childPatches.push(function (node) {
            var _diff7 = diff(oldVChildren[i], newVChildren[i])(node);

            var _diff8 = _slicedToArray(_diff7, 2);

            newVChildren[i] = _diff8[0];
            node = _diff8[1];
            return [newVChildren[i], node];
          });
        }
      }
    };

    for (var i = 0, l = oldVChildren.length; i < l; i++) {
      _loop3(i, l);
    }
    /**
     * get additional children if newVChildren array is bigger than old one
     * if elements in new array has keys insert it on specific position
     * else append it as last element of parent
     */


    function diffAditionalChildren(newVChildren, oldVChildren) {
      if (newVChildren.length > oldVChildren.length) {
        var _loop4 = function _loop4(_i3, _l) {
          if (!isArray(newVChildren[_i3])) {
            if (newVChildren[_i3]._key !== null) {
              if (!oldVChildren.some(function (f) {
                  return f._key === newVChildren[_i3]._key;
                })) {
                additionalPatches.push(function (parent) {
                  var newNodeDefinition = _render(newVChildren[_i3]);

                  newVChildren[_i3] = newNodeDefinition.virtualNode;

                  if (_i3 === newVChildren.length - 1) {
                    mount(newNodeDefinition, parent, 'appendChild');
                    _i2 = _i3;
                    return [newVChildren, parent];
                  }

                  mount(newNodeDefinition, parent, 'insertBefore', parent.childNodes[_i3]);
                  _i2 = _i3;
                  return [newVChildren, parent];
                });
              }
            } else {
              _i3 = _i3 + oldVChildren.length; //push index to the end of oldVChildren array so there are not already mounted children

              additionalPatches.push(function (parent) {
                var newNodeDefinition = _render(newVChildren[_i3]);

                newVChildren[_i3] = newNodeDefinition.virtualNode;
                mount(newNodeDefinition, parent, 'appendChild');
                _i2 = _i3;
                return [newVChildren, parent];
              });
            }
          } else {
            diffAditionalChildren(newVChildren[_i3], oldVChildren[_i3] || []);
          }

          _i2 = _i3;
        };

        for (var _i2 = 0, _l = newVChildren.length; _i2 < _l; _i2++) {
          _loop4(_i2, _l);
        }
      }
    }

    diffAditionalChildren(newVChildren, oldVChildren);
    /*
     *   apply all childNodes changes to parent realNode
     *   it is parent cause in diff it is realDOM and we diffChildren of parent, so recursively this is parent in function argument
     */

    return function (parent) {
      //zipping method is algorithm that sort patch and child to create a pair for patch the exact child
      zip(childPatches, parent.childNodes).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          patch = _ref3[0],
          child = _ref3[1];

        patch(child);
      });
      /**
       * apply additional changes right to the parent
       */

      var _loop5 = function _loop5(_i4) {
        shedule(function () {
          return additionalPatches[_i4](parent);
        });
      };

      for (var _i4 = 0; _i4 < additionalPatches.length; _i4++) {
        _loop5(_i4);
      }

      return [newVChildren, parent];
    };
  }

  function diffNonObjects(vOldNode, vNewNode, isVOldNodeObject, isVNewNodeObject) {
    /*
     *   if both are not a virtual node, it is text node, so replace its value 
     */
    if (!isVOldNodeObject && !isVNewNodeObject) {
      if (vOldNode !== vNewNode) {
        return function (node) {
          node.nodeValue = vNewNode;
          return [vNewNode, node];
        };
      } else {
        return function (node) {
          return [vOldNode, node];
        };
      }
    }
    /*
     *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
     */


    return function (node) {
      var newNodeDefinition = _render(vNewNode);

      shedule(function () {
        return mount(newNodeDefinition, node, 'replaceWith');
      });
      return [newNodeDefinition.virtualNode, newNodeDefinition.realDOM];
    };
  }

  function zip(first, second) {
    var zipped = [];

    for (var i = 0; i < Math.min(first.length, second.length); i++) {
      zipped.push([first[i], second[i]]);
    }

    return zipped;
  }

  var ReactiveHTML = {
    Component: Component,
    render: function render(virtualElement, container) {
      shedule(function () {
        if (!container || container.nodeType !== Node.ELEMENT_NODE) {
          throw TypeError("render(...) container must be valid Element that is already rendered on page, try to use DOMContentLoaded event on window to wait for all Elements load");
        }

        var newNodeDefinition = _render(virtualElement);

        virtualElement = newNodeDefinition.virtualNode;
        mount(newNodeDefinition, container, 'appendChild');
      });
    },
    createElement: createElement,
    createFactory: function createFactory(component) {
      if (isComponent(component)) {
        throw TypeError("createFactory(...) expecting first parameter as component Class, you give ".concat(_typeof(component)));
      }

      return function () {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        for (var _len3 = arguments.length, children = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
          children[_key4 - 1] = arguments[_key4];
        }

        return createElement.apply(void 0, [component, props].concat(children));
      };
    },
    memo: memo,
    ref: function ref(callback) {
      var refPayload = {
        node: null,
        resolved: false,
        _onresolve: callback
      };
      return refPayload;
    }
  };
  return ReactiveHTML;
});
