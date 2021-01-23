

export default function getSnapshotBeforeUpdateLifecycle(component) {

    return component.getSnapshotBeforeUpdate() || null;

}