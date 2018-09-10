class CommonBeteiligt {

    constructor(name, social, address, notes) {
        this._name = name;
        this._social = social;
        this._address = address;
        this._notes = notes;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get social() {
        return this._social;
    }

    set social(value) {
        this._social = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get notes() {
        return this._notes;
    }

    set notes(value) {
        this._notes = value;
    }

    isEmpty() {
        return !this.name && !this.social && !this.address && !this.notes;
    }
}

class OtherBeteiligt extends CommonBeteiligt {

    static create(jsonObj) {
        return this._create(jsonObj);
    }

    static _create(jsonObj) {
        if (jsonObj) {
            return new OtherBeteiligt(
                JsonSerialization.getProperty(jsonObj, 'name'),
                JsonSerialization.getProperty(jsonObj, 'social'),
                JsonSerialization.getProperty(jsonObj, 'address'),
                JsonSerialization.getProperty(jsonObj, 'notes'),
                JsonSerialization.getProperty(jsonObj, 'duedate')
            )
        } else {
            return new OtherBeteiligt();
        }
    }

    constructor(name, social, address, notes, duedate) {
        super(name, social, address, notes);
        this._duedate = duedate;
    }

    get duedate() {
        return this._duedate;
    }

    set duedate(value) {
        this._duedate = value;
    }

    isEmpty() {
        return super.isEmpty() && !this.duedate;
    }
}

class AdBeteiligt extends CommonBeteiligt {

    static create(jsonObj) {
        return this._create(jsonObj);
    }

    static _create(jsonObj) {
        if (jsonObj) {
            return new AdBeteiligt(
                JsonSerialization.getProperty(jsonObj, 'name'),
                JsonSerialization.getProperty(jsonObj, 'social'),
                JsonSerialization.getProperty(jsonObj, 'address'),
                JsonSerialization.getProperty(jsonObj, 'notes'),
                JsonSerialization.getProperty(jsonObj, 'format'),
                JsonSerialization.getProperty(jsonObj, 'placement'),
                JsonSerialization.getProperty(jsonObj, 'price')
            )
        } else {
            return new AdBeteiligt();
        }
    }

    constructor(name, social, address, notes, format, placement, price) {
        super(name, social, address, notes);
        this._format = format;
        this._placement = placement;
        this._price = price;
        this._total = 0;
    }

    get format() {
        return this._format;
    }

    set format(value) {
        this._format = value;
    }

    get placement() {
        return this._placement;
    }

    set placement(value) {
        this._placement = value;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        this._price = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    isEmpty() {
        return super.isEmpty() && !this.format && !this.placement && !this.price;
    }
}