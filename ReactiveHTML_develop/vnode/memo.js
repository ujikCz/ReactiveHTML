
export default function memo(virtualNode) {

    virtualNode._memo = true;
    return virtualNode;

}