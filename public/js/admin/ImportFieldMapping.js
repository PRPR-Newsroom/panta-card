class ImportFieldMapping extends FieldMapping {

    constructor(trello, adminService, pantaFields, header) {
        super(trello, adminService, pantaFields);
        this.header = header;
    }

    mapMember(member) {
        return `${member.fullName} (${member.username})`;
    }

    labelFilter(label, field) {
        return label.name === this.header.label && label.color === this.header.color;
    }

    mapLabel(label, field) {
        return `${label.name} (${label.color})`;
    }

    emptyValue() {
        return "&nbsp;";
    }

    mapArray(array) {
        return array.join('<br/>');
    }

    mapMembers(members) {
        return members;
    }
}