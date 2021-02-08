import updateComponent from '../../update/updateComponent.js';
import isFunction from '../../isFunction.js';
import isObject from '../../isObject.js';
import applyComponentUpdate from '../../update/applyComponentUpdate.js';


export default function setState(component, setter) {

    //setter can be object or function that returns object

    let newStateFromSetter;

    if(isObject(setter)) {

        newStateFromSetter = setter;

    } else if(isFunction(setter)) {

        newStateFromSetter = setter.bind(component)(component.props, component.state);

    } else {

        throw TypeError(`setState(...) expecting 1 parameter as Function or Object, you give ${ typeof setter }`);

    }

    if (Object.keys(newStateFromSetter).length) {

        const update = updateComponent(component, null, newStateFromSetter);
        //update component return patch which is function and snapshot that is given from getSnapshotBeforeUpdate

        applyComponentUpdate(update, (patch, snapshot) => {

            const componentInternals = component._internals;

            const patchedChild = patch(componentInternals.realDOM);

            Object.assign(componentInternals, {
                virtualNode: patchedChild.virtualNode,
                realDOM: patchedChild.realDOM
            });

            component.onComponentUpdate(snapshot);

        }, null);

        return component;

    }

    throw Error(`setState(...) must be Object or Function that returns Object, if Object is empty or doesn't return nothing, update can be redundant`);

}