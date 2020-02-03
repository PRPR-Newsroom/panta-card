class ExportFieldMapping extends FieldMapping {

    mapLabel(label) {
        return !!label;
    }

    labelFilter(label, field) {
        return label.name === field.name;
    }

    mapMember(member) {
        return member.name;
    }

    emptyValue() {
        return '';
    }


    mapArray(array) {
        return array;
    }
}