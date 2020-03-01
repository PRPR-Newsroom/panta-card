class ArrayField extends AbstractField {

    static getArrayValue(raw, treatEmptyAsNull = true) {
        return (isString(raw) ? raw.split(',') : []).filter(it => !treatEmptyAsNull || !isBlank(it));
    }

    getValue(node) {
        return ArrayField.getArrayValue(node.value.v);
    }

    getType() {
        return "array";
    }
}