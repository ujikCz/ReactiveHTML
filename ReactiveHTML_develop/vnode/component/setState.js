import updateComponent from '../../update/updateComponent.js';
import isFunction from '../../isFunction.js';
import isObject from '../../isObject.js';
import applyComponentUpdate from '../../update/applyComponentUpdate.js';
import rAF from '../../rAF.js';


export default function setState(component, setter, callback) {

    //setter can be object or function that returns object

    if (!component._internals.realDOM) {

        throw Error(`setState(...) can be called only if component is rendered, will be mounted or is mounted`);

    }

    if (isObject(setter) || isFunction(setter)) {

        setter = isFunction(setter) ? setter.bind(component)(component.props, component.state) : setter;
        //get the new state and save them in setter variable

        if (!isObject(setter) || Object.keys(setter).length === 0) {

            throw Error(`setState(...) must be Object or Function that returns Object, if Object is empty or doesn't return nothing, update can be redundant`);

        }

        const update = updateComponent(component, null, setter);
        //update component return patch which is function and snapshot that is given from getSnapshotBeforeUpdate

        applyComponentUpdate(update, (patch, snapshot) => {

            const componentInternals = component._internals;

            rAF(() => {

                const patchedChild = patch(componentInternals.realDOM);

                Object.assign(componentInternals, {
                    virtualNode: patchedChild.virtualNode,
                    realDOM: patchedChild.realDOM
                });

                component.onComponentUpdate(snapshot);

                if(callback) {

                    callback();

                }

            });

        }, null);

        return component;

    }

    throw TypeError(`setState(...) expecting 1 parameter as Function or Object, you give ${ typeof setter }`);

}