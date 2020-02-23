
class DateField extends AbstractField {

    static getDateOf(raw) {
        if (isNumber(raw)) {
            const value = parseFloat(raw);
            if (!isNaN(value)) {
                console.debug(`getDateOf: ${value}`);
                const date = XLSX.SSF.parse_date_code(value);
                return new Date(date.y, date.m - 1, date.d, date.H, date.M, date.S);
            }
        } else {
            console.debug(`getDateOf: ${raw} (raw)`);
            return new Date(raw);
        }
        console.debug(`getDateOf: null`);
        return null;
    }

    getValue(node) {
        return DateField.getDateOf(node.value.v);
    }

    getType() {
        return 'date';
    }
}