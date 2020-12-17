    /*
     *   trigger lifecycle method of component
     *   it can be triggered with additional arguments
     */

    export default function applyLifecycle(lifecycle, classLink, ...args) {

        if (lifecycle === undefined) return;

        return lifecycle.bind(classLink)(...args);

    }