


export default function diffClassList(oldClassList, newClassList) {

    const classListPatches = [];

    if(newClassList.length > oldClassList.length) {

        for(let i = 0; i < newClassList.length; i++) {

            if(!(oldClassList.includes(newClassList[i]))) {
    
                classListPatches.push(function(node) {
    
                    if(isNullOrUndef(newClassList[i])) {
    
                        node.classList.remove(oldClassList[i]);

                        if(!node.classList.length) {

                            node.removeAttribute('class');
        
                        }
    
                    } else {
    
                        node.classList.add(newClassList[i]);
    
                    }
    
                    return node;
    
                });
    
            }
    
        }

    }

    for(let i = 0; i < oldClassList.length; i++) {

        if(!(newClassList.includes(oldClassList[i]))) {

            classListPatches.push(function(node) {

                node.classList.remove(oldClassList[i]);

                if(!node.classList.length) {

                    node.removeAttribute('class');

                }

                return node;

            });

        }

    }

    return function(node) {

        for(let i = 0; i < classListPatches.length; i++) {

            node = classListPatches[i](node);

        }

        return node;

    }

}