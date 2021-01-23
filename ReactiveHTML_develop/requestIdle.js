

export default function requestIdle(callback) {
    
    const deadline = Date.now();
    
    function schedule() {

        window.requestIdleCallback(idleData => {
            const now = Date.now();

            if (idleData.timeRemaining() > 1 || now >= deadline) {

                return callback();

            }

            schedule();

        });

    }

    schedule();
    
}