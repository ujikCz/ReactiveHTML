
import updateComponent from '../../update/updateComponent.js';
import isFunction from '../../isFunction.js';
import isObject from '../../isObject.js';
import warn from '../../warn.js';
import { NON_OBJECT_RETURNED_FROM_SET_STATE } from '../../constants.js';
import assignNewPropsAndStates from './assignNewPropsAndStates.js';

export default function setState(component, setter, setStateSyncPropsUpdate) {

    //setter can be object or function that returns object

    if (!component.ref.realDOM) {

        throw Error(`setState(...) can be called only if component is rendered, will be mounted or is mounted`);

    }

    if (isObject(setter) || isFunction(setter)) {

        setter = isFunction(setter) ? setter.bind(component)(component.props, component.states) : setter;
        //get the new states and save them in setter variable

        warn(
            !isObject(setter) || Object.keys(setter).length === 0,
            `setState(...) should be Object or Function that returns Object, if Object is empty or doesn't return nothing, update can be redundant`,
            NON_OBJECT_RETURNED_FROM_SET_STATE
        );
        
        if(!setStateSyncPropsUpdate) {

            const update = updateComponent(component, null, setter);
            //update component return patch which is function and snapshot that is given from getSnapshotBeforeUpdate

            if(update) {

                const [patch, snapshot] = update;
                [component.ref.virtual, component.ref.realDOM] = patch(component.ref.realDOM);
                //patch the virtual dom and the real dom connected to component

                component.onComponentUpdate(snapshot);
                //call update lifecycle in the component

            }

            return component;

        }

        assignNewPropsAndStates(component, null, setter);

        return component;

    }

    throw TypeError(`setState(...) expecting 1 parameter as Function or Object, you give ${ typeof setter }`);

}