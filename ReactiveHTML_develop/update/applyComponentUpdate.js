

export default function applyComponentUpdate(updateObject, resolve, reject) {

    if (!updateObject) return reject;

    const [patch, snapshot] = updateObject;

    if (!patch) return reject;

    return resolve(patch, snapshot);

}