    /*
     *   convert children of virtualNode into virtualNodes if components
     */

    import checkProto from './checkProto.js';

    export default function convertClassToVnode(children) {

        return children.map(f => {

            return checkProto(f);

        });

    }