
const alreadyWarned = [];

export default function warn(condition, message, id) {

    if(condition) { // if condition is done

        if(id !== undefined) { // if id is specified

            if(!alreadyWarned.includes(id)) { // if id is not already in alreadyWarned array

                alreadyWarned.push(id); //add id to alredyWarned array
                console.warn(message); //warn

            }

        } else { // if id is not specified warn every time function is called

            console.warn(message);

        }

    }

}