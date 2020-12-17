  /*
   *   check differences between old virtualNode attributes and new one
   *   apply changes to realNode
   */

  export default function diffAttrs(oldAttrs, newAttrs) {

      const attrsPatches = [];

      for (const [k, v] of Object.entries(newAttrs)) {
          if (v !== oldAttrs[k]) {
              attrsPatches.push(
                  function (node) {
                      if (k === 'value') {
                          node.value = v;
                      }
                      node.setAttribute(k, v);
                      return node;
                  }
              );
          }
      }

      // remove old attributes
      for (const k in oldAttrs) {
          if (!(k in newAttrs)) {
              attrsPatches.push(
                  function (node) {
                      node.removeAttribute(k);
                      return node;
                  }
              );
          }
      }

      return function (node) {
          for (const patchattr of attrsPatches) {
              patchattr(node);
          }
      };

  }