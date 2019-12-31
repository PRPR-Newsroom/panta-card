
class TextField extends AbstractField {

    /**
     * @param {{value: {h}}} node
     * @return {string|{}|*}
     */
    getValue(node) {
        return node.value.v;
    }

    getType() {
        return 'text';
    }
}