    /*
     *   wait until elements is parsed by HTML parser
     *   then call callback function  
     */

    export default function onElementReady(selector, callback, disconnect = true, mode = true) {

        const observer = new MutationObserver((mutations, me) => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes).forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if ((mode && addedNode.matches(selector)) || (addedNode.localName === selector)) {
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