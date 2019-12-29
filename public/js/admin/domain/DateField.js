
class DateField extends AbstractField {

    static getDateOf(raw) {
        const value = parseFloat(raw);
        if (!isNaN(value)) {
            const date = XLSX.SSF.parse_date_code(value);
            return new Date(date.y, date.m - 1, date.d, date.H, date.M, date.S);
        }
        return null;
    }

    getValue(node) {
        return DateField.getDateOf(parseFloat(node.value.v));
    }

    getType() {
        return 'date';
    }
}