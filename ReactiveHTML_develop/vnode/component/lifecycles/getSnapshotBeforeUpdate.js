

export default function getSnapshotBeforeUpdateLIfecycle(component) {

    return component.getSnapshotBeforeUpdate() || null;

}