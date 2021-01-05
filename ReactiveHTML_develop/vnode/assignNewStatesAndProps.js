
import cloneObjectWithoutReference from '../cloneObjectWithoutReference.js';
import isObject from '../isObject.js';

/**
 * update props and states of updated component
 * @param { Object } oldComponent - class instance
 * @param { Object } nextProps - next props
 * @param { Object } nextStates - next states
 * @param { Boolean } willUpdate - if component will update, check if has getSnapshotAfterUpdate for extra operations
 */

export default function assignNewStatesAndProps(oldComponent, nextProps, nextStates, willUpdate) {

    // prepare for update states and prop, not update now because of next values of props and states 

    // if component has getSnapshotBeforeUpdate method prepare old values

    let oldProps, oldStates;

    if(oldComponent.getSnapshotBeforeUpdate && willUpdate) {

        [oldProps, oldStates] = [cloneObjectWithoutReference(oldComponent.props), cloneObjectWithoutReference(oldComponent.states)];

    }

    if(oldComponent.states && isObject(nextStates)) {

        Object.assign(oldComponent.states, nextStates);

    }
    
    if(oldComponent.props && isObject(nextProps)) {

        Object.assign(oldComponent.props, nextProps);

    }

    // if old value has values => oldComponent has snapshot method => trigger it

    if(oldProps || oldStates) {

        oldComponent.getSnapshotBeforeUpdate(oldProps, oldStates);

    }

    return;

}