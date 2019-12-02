class BooleanField extends AbstractField {

    constructor(name, reference, source) {
        super(name, reference, source);
    }

    getValue(node) {
        return !isBlank(node.value.v) && node.value.v !== 0;
    }

    set(value) {

    }
}