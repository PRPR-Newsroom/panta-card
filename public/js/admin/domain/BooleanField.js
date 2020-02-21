class BooleanField extends AbstractField {

    static getBooleanValue(raw) {
        // noinspection EqualityComparisonWithCoercionJS
        return !isBlank(raw) && raw != "0";
    }

    getValue(node) {
        return node && node.value ? BooleanField.getBooleanValue(node.value.v) : false;
    }

    getType() {
        return "boolean";
    }
}