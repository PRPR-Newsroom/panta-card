class ExportFieldMapping extends FieldMapping {

    /**
     * @param label
     * @param {AbstractField} field
     * @return {boolean}
     */
    mapLabel(label, field) {
        return !!label;
    }

    /**
     * @param label
     * @param {BooleanField} field
     * @return {boolean}
     */
    labelFilter(label, field) {
        return label.name === field.name && label.color === field.source.color;
    }

    mapMember(member) {
        return member.username;
    }

    emptyValue() {
        return '';
    }


    /**
     * @param {Array} array
     * @return {*}
     */
    mapArray(array) {
        return array.length === 1;
    }

    /**
     * @param {Iterable} members
     * @return {*}
     */
    mapMembers(members) {
        return members.join(',');
    }
}