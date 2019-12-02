
class TextField extends AbstractField {

    constructor(name, reference, source) {
        super(name, reference, source);
    }

    set(value) {
        this.reference
    }

    /**
     * @param {{value: {h}}} node
     * @return {string|{}|*}
     */
    getValue(node) {
        return node.value.h;
    }
}