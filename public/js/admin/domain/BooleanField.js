class BooleanField extends AbstractField {

    static getBooleanValue(raw) {
        return isNumber(raw) && parseFloat(raw) !== 0.0;
    }

    getValue(node) {
        return BooleanField.getBooleanValue(node.value.v);
    }

    getType() {
        return "boolean";
    }
}