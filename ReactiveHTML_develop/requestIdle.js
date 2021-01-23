
window.requestIdleCallback = window.requestIdleCallback || function(callback) {

    window.requestAnimationFrame(function() {
        callback({
            timeRemaining: () => 0
        });
    });

} //simple polyfill for IE10-IE11

export default function requestIdle(callback) {
    
    const deadline = performance.now();
    
    function schedule() {

        window.requestIdleCallback(idleData => {

            const now = performance.now();

            if (idleData.timeRemaining() > 1 || now >= deadline) {

                return callback();

            }

            schedule();

        });

    }

    schedule();
    
}