/*
    (c) Ludvík Prokopec
    License: MIT
    !This version is not recomended for production use
*/
(function(global, factory) {
  function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol ===
          "function" &&
          typeof Symbol
          .iterator === "symbol"
          ) {
          _typeof =
              function _typeof(
                  obj) {
                  return typeof obj;
              };
      } else {
          _typeof =
              function _typeof(
                  obj) {
                  return obj &&
                      typeof Symbol ===
                      "function" &&
                      obj
                      .constructor ===
                      Symbol &&
                      obj !==
                      Symbol
                      .prototype ?
                      "symbol" :
                      typeof obj;
              };
      }
      return _typeof(obj);
  }

  (typeof exports ===
      "undefined" ? "undefined" :
      _typeof(exports)) ===
  'object' && typeof module !==
      'undefined' ? module
      .exports = factory(
      _typeof) : typeof define ===
      'function' && define.amd ?
      define(function() {
          return factory(
              _typeof);
      }) : (global = global ||
          self, global
          .ReactiveHTML = factory(
              _typeof));
})(void 0, function(_typeof) {
  "use strict";

  function _slicedToArray(arr,
  i) {
      return _arrayWithHoles(
          arr) ||
          _iterableToArrayLimit(
              arr, i) ||
          _unsupportedIterableToArray(
              arr, i) ||
          _nonIterableRest();
  }

  function _nonIterableRest() {
      throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
          );
  }

  function _unsupportedIterableToArray(
      o, minLen) {
      if (!o) return;
      if (typeof o === "string")
          return _arrayLikeToArray(
              o, minLen);
      var n = Object.prototype
          .toString.call(o).slice(
              8, -1);
      if (n === "Object" && o
          .constructor) n = o
          .constructor.name;
      if (n === "Map" || n ===
          "Set") return Array
          .from(o);
      if (n === "Arguments" ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/
          .test(n))
      return _arrayLikeToArray(
              o, minLen);
  }

  function _arrayLikeToArray(arr,
      len) {
      if (len == null || len > arr
          .length) len = arr
          .length;
      for (var i = 0, arr2 =
              new Array(len); i <
          len; i++) {
          arr2[i] = arr[i];
      }
      return arr2;
  }

  function _iterableToArrayLimit(
      arr, i) {
      if (typeof Symbol ===
          "undefined" || !(Symbol
              .iterator in Object(
                  arr))) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;
      try {
          for (var _i = arr[Symbol
                      .iterator]
              (), _s; !(_n = (_s =
                      _i.next())
                  .done); _n =
              true) {
              _arr.push(_s.value);
              if (i && _arr
                  .length === i)
                  break;
          }
      } catch (err) {
          _d = true;
          _e = err;
      } finally {
          try {
              if (!_n && _i[
                      "return"] !=
                  null) _i[
                  "return"]();
          } finally {
              if (_d) throw _e;
          }
      }
      return _arr;
  }

  function _arrayWithHoles(arr) {
      if (Array.isArray(arr))
          return arr;
  }

  function memo(virtualNode) {
      virtualNode._memo = true;
      return virtualNode;
  }

  function isObject(object) {
      return _typeof(object) ===
          'object' && object !==
          null;
  }

  function isFunction(func) {
      return typeof func ===
          'function';
  }

  function isComponent(type) {
      if (isFunction(type) && type
          .prototype
          .isReactiveHTMLComponent
          ) return true;
      return false;
  }

  function isArray(array) {
      return Array.isArray(array);
  }

  function createElement(type) {
      var props = arguments
          .length > 1 &&
          arguments[1] !==
          undefined ? arguments[
          1] : null;
      var _key = null;

      if (props !== null && props
          ._key !== undefined) {
          _key = props._key;
          Reflect.deleteProperty(
              props, '_key');
      }

      if (isComponent(type)) {
          return {
              type: type,
              props: props,
              _key: _key
          };
      }

      for (var _len = arguments
              .length, children =
              new Array(_len > 2 ?
                  _len - 2 : 0),
              _key2 = 2; _key2 <
          _len; _key2++) {
          children[_key2 - 2] =
              arguments[_key2];
      }

      return {
          type: type,
          attrs: props,
          children: children,
          _key: _key
      };
  }

  function assignNewPropsAndStates(
      oldComponent, nextProps,
      nextStates) {
      if (isObject(nextProps)) {
          if (oldComponent
              .props) {
              Object.assign(
                  oldComponent
                  .props,
                  nextProps);
          } else {
              oldComponent.props =
                  nextProps;
          }
      }

      if (isObject(nextStates)) {
          if (oldComponent
              .states) {
              Object.assign(
                  oldComponent
                  .states,
                  nextStates);
          } else {
              oldComponent
                  .states =
                  nextStates;
          }
      }

      return oldComponent;
  }

  function Component(props) {
      this.props = props || {};
      this.ref = {};
      return this;
  }

  Component.prototype.Element =
      function() {
          throw Error(
              "You have to specify Element method in your Component, if you want to return any element, return "
              .concat(
                  undefined));
      };

  Component.prototype.setState =
      function(setter) {
          function initUpdate(
              _this, nextStates) {
              if (_this.ref
                  .realDOM) {
                  var _updateComponent =
                      updateComponent(
                          _this,
                          _this,
                          nextStates
                          ),
                      _updateComponent2 =
                      _slicedToArray(
                          _updateComponent,
                          2),
                      patch =
                      _updateComponent2[
                          0],
                      snapshot =
                      _updateComponent2[
                          1];

                  var _patch =
                      patch(_this
                          .ref
                          .realDOM
                          );

                  var _patch2 =
                      _slicedToArray(
                          _patch,
                          2);

                  _this.vnode =
                      _patch2[0];
                  _this.ref
                      .realDOM =
                      _patch2[1];
                  componentAfterUpdateLifecycles
                      (_this,
                          snapshot
                          );
              } else if (_this.ref
                  .parent) {
                  assignNewPropsAndStates
                      (_this,
                          _this,
                          nextStates
                          );

                  _this
                      .onComponentWillRender();

                  var newVNode =
                      _this
                      .Element();

                  var newNode =
                      render(
                          newVNode
                          );
                  _this.vnode =
                      newVNode;
                  _this.ref
                      .realDOM =
                      newNode;

                  _this
                      .onComponentRender(
                          newNode
                          );

                  _this
                      .onComponentWillMount(
                          newNode
                          );

                  _this.ref.parent
                      .appendChild(
                          newNode
                          );

                  _this
                      .onComponentMount(
                          newNode
                          );

                  _this.ref
                      .parent =
                      undefined;
              }

              return _this;
          }

          if (isFunction(
              setter)) {
              var nextStates =
                  setter.bind(
                      this)();
              return initUpdate(
                  this,
                  nextStates);
          }

          if (isObject(setter)) {
              return initUpdate(
                  this, setter
                  );
          }

          throw TypeError(
              "setState method expecting 1 parameter as Function or Object, you give "
              .concat(_typeof(
                  setter)));
      };

  Component.prototype
      .onComponentUpdate =
      Component.prototype
      .onComponentWillUpdate =
      Component.prototype
      .onComponentRender =
      Component.prototype
      .onComponentWillRender =
      Component.prototype
      .onComponentMount =
      Component.prototype
      .onComponentWillMount =
      Component.prototype
      .onComponentUnMount =
      Component.prototype
      .onComponentWillUnMount =
      Component.prototype
      .onComponentCancelUpdate =
      function() {};

  Component.prototype
      .shouldComponentUpdate =
      function() {
          return true;
      };

  Component.prototype
      .isReactiveHTMLComponent =
      true;

  function componentAfterUpdateLifecycles(
      component, snapshot) {
      if (component.vnode ===
          undefined) {
          component
              .onComponentUnMount();
      } else {
          component
              .onComponentUpdate(
                  component.ref
                  .realDOM,
                  snapshot);
      }
  }

  function componentBeforeUpdateLifecycles(
      component, newVNode,
      snapshot) {
      if (newVNode ===
          undefined) {
          component
              .onComponentWillUnMount(
                  component.ref
                  .realDOM);
          component.ref.parent =
              component.ref
              .realDOM.parentNode;
      } else {
          component
              .onComponentWillUpdate(
                  component.ref
                  .realDOM,
                  snapshot);
      }
  }

  function createComponentInstance(
      component) {
      var instance = new component
          .type(component.props);
      instance.vnode = instance
          .Element();
      instance.type = component
          .type;
      instance._key = component
          ._key;
      return instance;
  }

  function filterVirtualElements(
      virtualElement) {
      if (isArray(
          virtualElement)) {
          //array
          return virtualElement
              .map(function(
                  virtualNode
                  ) {
                  return filterVirtualElements(
                      virtualNode
                      );
              });
      }

      if (!isObject(
              virtualElement) || !
          isComponent(
              virtualElement.type)
          ) {
          //element 
          //OR
          //text node
          return virtualElement;
      } //component


      virtualElement =
          createComponentInstance(
              virtualElement);
      virtualElement.vnode =
          filterVirtualElements(
              virtualElement.vnode
              );
      virtualElement
          .onComponentWillRender();
      return virtualElement;
  }

  function updateComponent(
      oldComponent, newComponent,
      nextStates) {
      if (oldComponent._memo) {
          oldComponent
              .onComponentCancelUpdate({
                  cancelType: memo
              });
          return function() {
              return [oldComponent
                  .vnode,
                  oldComponent
                  .ref
                  .realDOM
              ];
          };
      }

      if (oldComponent
          .shouldComponentUpdate(
              newComponent.props,
              nextStates) ===
          false) {
          oldComponent =
              assignNewPropsAndStates(
                  oldComponent,
                  newComponent
                  .props,
                  nextStates);
          oldComponent
              .onComponentCancelUpdate({
                  cancelType: oldComponent
                      .onComponentCancelUpdate
              });
          return function() {
              return [oldComponent
                  .vnode,
                  oldComponent
                  .ref
                  .realDOM
              ];
          };
      }

      var snapshot = null;

      if (oldComponent
          .getSnapshotBeforeUpdate
          ) {
          snapshot = oldComponent
              .getSnapshotBeforeUpdate(
                  oldComponent
                  .props,
                  oldComponent
                  .states) ||
              null;
      }

      oldComponent =
          assignNewPropsAndStates(
              oldComponent,
              newComponent.props,
              nextStates);
      var newVNode = oldComponent
          .Element();
      componentBeforeUpdateLifecycles
          (oldComponent, newVNode,
              snapshot);
      return [diff(oldComponent
          .vnode, newVNode
          ), snapshot];
  }

  function render(virtualNode) {
      if (!isObject(
          virtualNode)) {
          //text node
          return document
              .createTextNode(
                  virtualNode);
      }

      if (isComponent(virtualNode
              .type)) {
          virtualNode.ref
              .realDOM = render(
                  virtualNode
                  .vnode);
          virtualNode
              .onComponentRender(
                  virtualNode.ref
                  .realDOM
                  ); //virtualNode

          return virtualNode.ref
              .realDOM;
      }

      return createDomElement(
          virtualNode);
  }

  function mount(instance,
      container, method) {
      var elementFromInstance =
          render(instance);
      var isComponentCache =
          isObject(instance) &&
          isComponent(instance
              .type);

      if (isComponentCache) {
          instance
              .onComponentWillMount(
                  elementFromInstance
                  );
      }

      for (var _len2 = arguments
              .length, args =
              new Array(_len2 >
                  3 ? _len2 - 3 :
                  0), _key3 =
              3; _key3 <
          _len2; _key3++) {
          args[_key3 - 3] =
              arguments[_key3];
      }

      container[method].apply(
          container, [
              elementFromInstance
          ].concat(args));

      if (isComponentCache) {
          instance
              .onComponentMount(
                  elementFromInstance
                  );
      }

      return elementFromInstance;
  }

  function createDomElement(
  vnode) {
      var el = document
          .createElement(vnode
              .type);

      for (var key in vnode
          .attrs) {
          if (key.startsWith(
              'on')) {
              el.addEventListener(
                  key.replace(
                      'on', ''
                      ), vnode
                  .attrs[key]);
              continue;
          } else if (isObject(
                  vnode.attrs[key]
                  )) {
              Object.assign(el[
                      key],
                  vnode.attrs[
                      key]);
              continue;
          } else {
              el[key] = vnode
                  .attrs[key];
          }
      }

      if (vnode.children.length) {
          for (var i = 0, ch =
                  vnode
                  .children; i <
              ch.length; i++) {
              var rendered =
                  filterVirtualElements(
                      ch[i]);

              if (isArray(
                      rendered)) {
                  for (var j =
                      0; j <
                      rendered
                      .length; j++
                      ) {
                      var renderedFromArray =
                          filterVirtualElements(
                              rendered[
                                  j
                                  ]
                              );
                      rendered[
                          j] =
                          renderedFromArray;
                      mount(renderedFromArray,
                          el,
                          'appendChild'
                          );
                  }

                  vnode.children[
                          i] =
                      rendered;
              } else {
                  vnode.children[
                          i] =
                      rendered;
                  mount(rendered,
                      el,
                      'appendChild'
                      );
              }
          }
      }

      return el;
  }

  function diff(vOldNode,
      vNewNode) {
      /**
       * cache all statements
       */
      var isVOldNodeObject =
          isObject(vOldNode);
      var isVNewNodeObject =
          isObject(vNewNode);
      var isVOldNodeComponent =
          isVOldNodeObject ?
          isComponent(vOldNode
              .type) : false;
      var isVNewNodeComponent =
          isVNewNodeObject ?
          isComponent(vNewNode
              .type) : false;
      /*
       *   if new virtualNode is undefined (doesn't exists) and old virtualNode exists, remove the realNode
       */

      if (vNewNode ===
          undefined) {
          return function(node) {
              node.remove();
              return [undefined,
                  undefined
              ];
          };
      }

      if (isVOldNodeComponent &&
          isVNewNodeComponent) {
          if (vOldNode.type ===
              vNewNode.type) {
              return function(
                  node) {
                  var _updateComponent3 =
                      updateComponent(
                          vOldNode,
                          vNewNode
                          ),
                      _updateComponent4 =
                      _slicedToArray(
                          _updateComponent3,
                          2),
                      patch =
                      _updateComponent4[
                          0],
                      snapshot =
                      _updateComponent4[
                          1];

                  var _patch3 =
                      patch(
                          node
                          );

                  var _patch4 =
                      _slicedToArray(
                          _patch3,
                          2);

                  vOldNode
                      .vnode =
                      _patch4[
                          0];
                  node =
                      _patch4[
                          1];
                  componentAfterUpdateLifecycles
                      (vOldNode,
                          snapshot
                          );
                  return [vOldNode,
                      node
                  ];
              };
          }

          return function(node) {
              vOldNode
                  .onComponentWillUnMount(
                      vOldNode
                      .ref
                      .realDOM
                      );
              var vNewNodeInstance =
                  createComponentInstance(
                      vNewNode
                      );

              var _diff =
                  diff(
                      vOldNode
                      .vnode,
                      vNewNodeInstance
                      .vnode)(
                      node);

              var _diff2 =
                  _slicedToArray(
                      _diff, 2
                      );

              vNewNodeInstance
                  .vnode =
                  _diff2[0];
              node = _diff2[
              1];
              vNewNodeInstance
                  .onComponentRender(
                      node);
              vNewNodeInstance
                  .onComponentWillMount(
                      node);
              vNewNodeInstance
                  .ref
                  .realDOM =
                  node;
              vOldNode.ref
                  .parent =
                  vOldNode.ref
                  .realDOM
                  .parentNode;
              vOldNode.ref
                  .realDOM =
                  undefined;
              vOldNode
                  .onComponentUnMount();
              vNewNodeInstance
                  .onComponentMount(
                      node);
              return [vNewNodeInstance,
                  node
              ];
          };
      }

      if (isVOldNodeComponent && !
          isVNewNodeComponent) {
          return function(node) {
              var patch =
                  diff(
                      vOldNode
                      .vnode,
                      vNewNode
                      );
              vOldNode
                  .onComponentWillUnMount(
                      vOldNode
                      .ref
                      .realDOM
                      );

              var _patch5 =
                  patch(node);

              var _patch6 =
                  _slicedToArray(
                      _patch5,
                      2);

              vNewNode =
                  _patch6[0];
              node = _patch6[
                  1];
              vOldNode.ref
                  .parent =
                  vOldNode.ref
                  .realDOM
                  .parentNode;
              vOldNode.ref
                  .realDOM =
                  undefined;
              vOldNode
                  .onComponentUnMount();
              return [vNewNode,
                  node
              ];
          };
      }

      if (!isVOldNodeComponent &&
          isVNewNodeComponent) {
          return function(node) {
              var vNewNodeInstance =
                  createComponentInstance(
                      vNewNode
                      );
              var patch =
                  diff(
                      vOldNode,
                      vNewNodeInstance
                      .vnode);

              var _patch7 =
                  patch(node);

              var _patch8 =
                  _slicedToArray(
                      _patch7,
                      2);

              vNewNode =
                  _patch8[0];
              node = _patch8[
                  1];
              vNewNodeInstance
                  .onComponentWillRender();
              vNewNodeInstance
                  .ref
                  .realDOM =
                  node;
              vNewNodeInstance
                  .onComponentRender(
                      node);
              vNewNodeInstance
                  .onComponentWillMount(
                      node);
              vNewNodeInstance
                  .onComponentMount(
                      node);
              return [vNewNode,
                  node
              ];
          };
      }
      /*
       *   if both are not a virtual node, it is text node, so replace its value 
       */


      if (!isVOldNodeObject && !
          isVNewNodeObject) {
          if (vOldNode !==
              vNewNode) {
              return function(
                  node) {
                  node.nodeValue =
                      vNewNode;
                  return [vNewNode,
                      node
                  ];
              };
          } else {
              return function(
                  node) {
                  return [vOldNode,
                      node
                  ];
              };
          }
      }
      /*
       *   if one of virtualNodes is not virtualNode (means Number or String) replace it as textNode
       */


      if (!isVOldNodeObject &&
          isVNewNodeObject ||
          isVOldNodeObject && !
          isVNewNodeObject) {
          return function(node) {
              var newVirtualNode =
                  filterVirtualElements(
                      vNewNode
                      );
              var newRealNode =
                  mount(
                      newVirtualNode,
                      node,
                      'replaceWith'
                      );
              return [newVirtualNode,
                  newRealNode
              ];
          };
      }
      /*
       *   if tagNames of virtualNodes doesn't match replace it with new rendered virtualNode 
       */


      if (vOldNode.type !==
          vNewNode.type) {
          return function(node) {
              var newVirtualNode =
                  filterVirtualElements(
                      vNewNode
                      );
              var newRealNode =
                  mount(
                      newVirtualNode,
                      node,
                      'replaceWith'
                      );
              return [newVirtualNode,
                  newRealNode
              ];
          };
      }

      return function(node) {
          if (vOldNode
              ._memo) {
              return [vOldNode,
                  node
              ];
          }

          if (isObject(
                  vOldNode
                  .attrs) ||
              isObject(
                  vNewNode
                  .attrs)) {
              var _diffAttrs =
                  diffAttrs(
                      vOldNode
                      .attrs ||
                      {},
                      vNewNode
                      .attrs ||
                      {})(
                      node);

              var _diffAttrs2 =
                  _slicedToArray(
                      _diffAttrs,
                      2);

              vNewNode.attrs =
                  _diffAttrs2[
                      0];
              node =
                  _diffAttrs2[
                      1];
          }

          if (vOldNode
              .children
              .length +
              vNewNode
              .children
              .length > 0) {
              var _diffChildren =
                  diffChildren(
                      vOldNode
                      .children,
                      vNewNode
                      .children
                      )(node);

              var _diffChildren2 =
                  _slicedToArray(
                      _diffChildren,
                      2);

              vNewNode
                  .children =
                  _diffChildren2[
                      0];
              node =
                  _diffChildren2[
                      1];
          }

          return [vNewNode,
              node
          ];
      };
  }

  function diffAttrs(oldAttrs,
      newAttrs) {
      var attrsPatches = [];

      var _loop = function _loop(
          key) {
          if (key.startsWith(
                  'on')) {
              if (!(key in
                      oldAttrs
                      )) {
                  // add event listeners
                  attrsPatches
                      .push(
                          function(
                              node
                              ) {
                              node.addEventListener(
                                  key
                                  .replace(
                                      'on',
                                      ''
                                      ),
                                  newAttrs[
                                      key
                                      ]
                                  );
                              return node;
                          });
              }
          } else if (isObject(
                  newAttrs[
                      key])) {
              // if is object set property by object assign
              attrsPatches
                  .push(
                      function(
                          node
                          ) {
                          Object
                              .assign(
                                  node[
                                      key
                                      ],
                                  newAttrs[
                                      key
                                      ]
                                  );
                          return node;
                      });
          } else if (newAttrs[
                  key] !==
              oldAttrs[key] ||
              !(key in
                  oldAttrs)) {
              attrsPatches
                  .push(
                      function(
                          node
                          ) {
                          node[
                                  key] =
                              newAttrs[
                                  key
                                  ];
                          return node;
                      });
          }
      };

      for (var key in newAttrs) {
          _loop(key);
      } // remove old attributes


      var _loop2 =
          function _loop2(k) {
              if (!(k in
                  newAttrs)) {
                  if (k
                      .startsWith(
                          'on')) {
                      // is event, remove event listener
                      attrsPatches
                          .push(
                              function(
                                  node
                                  ) {
                                  node.removeEventListener(
                                      k
                                      .replace(
                                          'on',
                                          ''
                                          ),
                                      oldAttrs[
                                          k
                                          ]
                                      );
                                  console
                                      .log(
                                          node
                                          );
                                  return node;
                              });
                  } else {
                      // else remove attribute from element
                      attrsPatches
                          .push(
                              function(
                                  node
                                  ) {
                                  node.removeAttribute(
                                      k
                                      );
                                  return node;
                              });
                  }
              }
          };

      for (var k in oldAttrs) {
          _loop2(k);
      }

      return function(node) {
          for (var i = 0; i <
              attrsPatches
              .length; i++) {
              node =
                  attrsPatches[
                      i](
                  node);
          }

          return [newAttrs,
              node
          ];
      };
  }

  function diffChildren(
      oldVChildren, newVChildren
      ) {
      var childPatches = [];
      var additionalPatches = [];

      var _loop3 =
          function _loop3(i, l) {
              if (isArray(
                      oldVChildren[
                          i])) {
                  additionalPatches
                      .push(
                          diffChildren(
                              oldVChildren[
                                  i
                                  ],
                              newVChildren[
                                  i
                                  ]
                              ));
              } else {
                  if (isObject(
                          oldVChildren[
                              i]
                          ) &&
                      oldVChildren[
                          i]
                      ._key !==
                      null) {
                      childPatches
                          .push(
                              function(
                                  node
                                  ) {
                                  var findedByKey =
                                      newVChildren
                                      .find(
                                          function(
                                              f
                                              ) {
                                              return f
                                                  ._key ===
                                                  oldVChildren[
                                                      i
                                                      ]
                                                  ._key;
                                          }
                                          );
                                  var indexInNewVChildren =
                                      newVChildren
                                      .indexOf(
                                          findedByKey
                                          );

                                  var _diff3 =
                                      diff(
                                          oldVChildren[
                                              i
                                              ],
                                          findedByKey
                                          )
                                      (
                                          node);

                                  var _diff4 =
                                      _slicedToArray(
                                          _diff3,
                                          2
                                          );

                                  newVChildren
                                      [
                                          indexInNewVChildren] =
                                      _diff4[
                                          0
                                          ];
                                  node =
                                      _diff4[
                                          1
                                          ];
                                  return [newVChildren[
                                          indexInNewVChildren
                                          ],
                                      node
                                  ];
                              });
                  } else {
                      childPatches
                          .push(
                              function(
                                  node
                                  ) {
                                  var _diff5 =
                                      diff(
                                          oldVChildren[
                                              i
                                              ],
                                          newVChildren[
                                              i
                                              ]
                                          )
                                      (
                                          node);

                                  var _diff6 =
                                      _slicedToArray(
                                          _diff5,
                                          2
                                          );

                                  newVChildren
                                      [
                                          i] =
                                      _diff6[
                                          0
                                          ];
                                  node =
                                      _diff6[
                                          1
                                          ];
                                  return [newVChildren[
                                          i
                                          ],
                                      node
                                  ];
                              });
                  }
              }
          };

      for (var i = 0, l =
              oldVChildren
              .length; i < l; i++
          ) {
          _loop3(i, l);
      }

      if (newVChildren.length >
          oldVChildren.length) {
          var _loop4 =
              function _loop4(_i3,
                  _l) {
                  if (!isArray(
                          newVChildren[
                              _i3]
                          )) {
                      if (newVChildren[
                              _i3]
                          ._key !==
                          null) {
                          if (!
                              oldVChildren
                              .some(
                                  function(
                                      f
                                      ) {
                                      return f
                                          ._key ===
                                          newVChildren[
                                              _i3
                                              ]
                                          ._key;
                                  }
                                  )
                              ) {
                              additionalPatches
                                  .push(
                                      function(
                                          node
                                          ) {
                                          var newVNode =
                                              filterVirtualElements(
                                                  newVChildren[
                                                      _i3
                                                      ]
                                                  );
                                          newVChildren
                                              [
                                                  _i3] =
                                              newVNode;

                                          if (_i3 ===
                                              newVChildren
                                              .length -
                                              1
                                              ) {
                                              mount
                                                  (newVNode,
                                                      node,
                                                      'appendChild'
                                                      );
                                              _i2 =
                                                  _i3;
                                              return [newVNode,
                                                  node
                                              ];
                                          }

                                          mount
                                              (newVNode,
                                                  node,
                                                  'insertBefore',
                                                  node
                                                  .childNodes[
                                                      _i3
                                                      ]
                                                  );
                                          _i2 =
                                              _i3;
                                          return [newVNode,
                                              node
                                          ];
                                      }
                                      );
                          }
                      } else {
                          _i3 =
                              oldVChildren
                              .length;
                          additionalPatches
                              .push(
                                  function(
                                      node
                                      ) {
                                      var newVNode =
                                          filterVirtualElements(
                                              newVChildren[
                                                  _i3
                                                  ]
                                              );
                                      newVChildren
                                          [
                                              _i3] =
                                          newVNode;
                                      mount
                                          (newVNode,
                                              node,
                                              'appendChild'
                                              );
                                      _i2 =
                                          _i3;
                                      return [newVNode,
                                          node
                                      ];
                                  }
                                  );
                      }
                  }

                  _i2 = _i3;
              };

          for (var _i2 = 0, _l =
                  newVChildren
                  .length; _i2 <
              _l; _i2++) {
              _loop4(_i2, _l);
          }
      }
      /*
       *   apply all childNodes changes to parent realNode
       */


      return function(parent) {
          zip(childPatches,
                  parent
                  .childNodes)
              .forEach(
                  function(
                      _ref) {
                      var _ref2 =
                          _slicedToArray(
                              _ref,
                              2
                              ),
                          patch =
                          _ref2[
                              0
                              ],
                          child =
                          _ref2[
                              1
                              ];

                      patch(
                          child);
                  });

          for (var _i4 =
              0; _i4 <
              additionalPatches
              .length; _i4++
              ) {
              additionalPatches
                  [_i4](
                      parent);
          }

          return [newVChildren,
              parent
          ];
      };
  }

  function zip(first, second) {
      var zipped = [];

      for (var i = 0; i < Math
          .min(first.length,
              second.length); i++
          ) {
          zipped.push([first[i],
              second[i]
          ]);
      }

      return zipped;
  }

  var ReactiveHTML = {
      Component: Component,
      render: function render(
          virtualElement,
          container) {
          virtualElement =
              filterVirtualElements(
                  virtualElement
                  );
          mount(virtualElement,
              container,
              'appendChild'
              );
      },
      createElement: createElement,
      createFactory: function createFactory(
          component) {
          if (isComponent(
                  component
                  )) {
              throw TypeError(
                  "createFactory expecting first parameter as component Class, you give "
                  .concat(
                      _typeof(
                          component
                          )
                      )
                  );
          }

          return function() {
              var props =
                  arguments
                  .length >
                  0 &&
                  arguments[
                      0
                      ] !==
                  undefined ?
                  arguments[
                      0
                      ] :
                  {};
              return createElement(
                  component,
                  props
                  );
          };
      },
      memo: memo
  };
  return ReactiveHTML;
});
