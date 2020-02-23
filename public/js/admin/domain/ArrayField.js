class ArrayField extends AbstractField {

    static getArrayValue(raw) {
        return isString(raw) ? raw.split(',') : [];
    }

    getValue(node) {
        return ArrayField.getArrayValue(node.value.v);
    }

    getType() {
        return "array";
    }
}