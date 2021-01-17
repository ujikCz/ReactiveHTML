
export default function requestIdle(element) {

    return new Promise((resolve, reject) => {

        window.requestAnimationFrame(function () {

            resolve(element);

        });

    });

}