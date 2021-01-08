

export default function triggerLifecycle(lifecycle, context, ...args) {

    if(lifecycle) {

        return lifecycle.bind(context)(...args);

    }

    return;

}