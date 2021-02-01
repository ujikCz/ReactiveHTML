

export default function shedule(callback, secCallback) {

    if(!secCallback)
    return window.requestAnimationFrame(callback);

    return window.requestAnimationFrame(() => {

        callback();
        secCallback();

    });
}