class ExportFieldMapping extends FieldMapping {

    mapLabel(label, field) {
        return !!label;
    }

    labelFilter(label, field) {
        return label.name === field.name;
    }

    mapMember(member) {
        return member.email;
    }

    emptyValue() {
        return '';
    }


    mapArray(array) {
        return array;
    }

    /**
     * @param {Iterable} members
     * @return {*}
     */
    mapMembers(members) {
        return members.join(',');
    }
}