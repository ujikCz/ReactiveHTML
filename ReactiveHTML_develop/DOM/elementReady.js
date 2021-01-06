

    /**
     * wait until elements is parsed by HTML parser
     * then call callback function  
     * @param { String } selector - selector of element
     * @param { function } callback - callback function that will be triggered after element is ready
     * @param { Boolean } disconnect - disconnect after element finded or not
     * @param { Boolean } mode - matches all selectors or only localNames of elements
     */

    export default function elementReady(selector, callback, disconnect = true) {

        const observer = new MutationObserver((mutations, me) => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.matches(selector)) {
                            callback(addedNode);
                            if (disconnect) me.disconnect();
                        }
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        return observer;

    }