
class TextField extends AbstractField {

    /**
     * @param {{value: {h}}} node
     * @return {string|{}|*}
     */
    getValue(node) {
        return node && node.value && node.value.v ? `${node.value.v}`.trim() : null;
    }

    getType() {
        return 'text';
    }
}