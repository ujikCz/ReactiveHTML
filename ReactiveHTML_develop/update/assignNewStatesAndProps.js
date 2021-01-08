
import cloneObjectWithoutReference from '../cloneObjectWithoutReference.js';

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

    if(willUpdate && oldComponent.getSnapshotBeforeUpdate) {

        [oldProps, oldStates] = [cloneObjectWithoutReference(oldComponent.props), cloneObjectWithoutReference(oldComponent.states)];

        willUpdate = 2; // use old value instead of creating new one

    }

    if(nextStates !== null) {

        oldComponent.states = nextStates; 

    }
    
    if(nextProps !== null) {

        oldComponent.props = nextProps; 

    }

    // if old value has values => oldComponent has snapshot method => trigger it

    if(willUpdate === 2) { //means component will update and component has getSnapshot method

        oldComponent.getSnapshotBeforeUpdate(oldProps, oldStates);

    }

    return;

}