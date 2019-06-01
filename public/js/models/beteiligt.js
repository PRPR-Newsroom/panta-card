
class ModuleConfig {

    static get VERSION() {
        return 2;
    }

    /**
     * @param jsonObj
     * @param configuration the configuration that is used to get the right layout for the sections if the section is empty
     * @returns {ModuleConfig}
     */
    static create(jsonObj, configuration) {
        let sections = JsonSerialization.getProperty(jsonObj, 'sections') || {};
        return new ModuleConfig(JsonSerialization.getProperty(jsonObj, 'id'),
            {
                'onsite': CommonBeteiligt.create(sections.onsite, ModuleConfig._getSectionFactory(configuration, "onsite")),
                'text': CommonBeteiligt.create(sections.text, ModuleConfig._getSectionFactory(configuration, "text")),
                'photo': CommonBeteiligt.create(sections.photo, ModuleConfig._getSectionFactory(configuration, "photo")),
                'video': CommonBeteiligt.create(sections.video, ModuleConfig._getSectionFactory(configuration, "video")),
                'illu': CommonBeteiligt.create(sections.illu, ModuleConfig._getSectionFactory(configuration, "illu")),
                'ad': CommonBeteiligt.create(sections.ad, ModuleConfig._getSectionFactory(configuration, "ad"))
            });
    }

    /**
     * Get the section factory depending on the id and configuration
     * @param configuration
     * @param id
     * @private
     */
    static _getSectionFactory(configuration, id) {
        let editable = configuration.config.editables
            .filter(function (editable) {
                return editable.id === id;
            })[0];
        if (editable.layout === 'regular') {
            return function() {
                return OtherBeteiligt.create();
            }
        } else {
            return function() {
                return AdBeteiligt.create();
            }
        }
    }
    
    constructor(id, sections) {
        this._id = id || uuid();
        this._sections = sections;
        this._version = CommonBeteiligt.VERSION;
    }

    /**
     * Get the number of sections that have content
     *
     * @return {number}
     */
    getContentCount() {
        return Object.values(this.sections).filter(function(section) {
            return !section.isEmpty();
        }).length;
    }

    get sections() {
        return this._sections;
    }

    set sections(value) {
        this._sections = value;
    }
}

class CommonBeteiligt {

    static get VERSION() {
        return 2;
    }

    /**
     * Create the beteiligt entity depending on its type
     * @param jsonObj
     * @param factory to get a default beteiligt instance
     * @returns {CommonBeteiligt}
     */
    static create(jsonObj, factory) {
        // detect type
        if (jsonObj) {
            let type = JsonSerialization.getProperty(jsonObj, "type");
            switch (type) {
                case "ad":
                    return AdBeteiligt.create(jsonObj);
                case "other":
                    return OtherBeteiligt.create(jsonObj);
                default:
                    return factory ? factory() : null;
            }
        } else {
            // if nothing else configured we assume it's a OtherBeteiligt layout
            return factory ? factory.call(this) : null;
        }
    }

    constructor(id, name, social, address, notes) {
        this._id = id || uuid();
        this._name = name;
        this._social = social;
        this._address = address;
        this._notes = notes;
        this._version = CommonBeteiligt.VERSION;
        this._type = null;
        this._id = id;
    }

    get id() {
        return this._id;
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

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    isEmpty() {
        return isBlank(this.name) && isBlank(this.social) && isBlank(this.address) && isBlank(this.notes);
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }
}

class OtherBeteiligt extends CommonBeteiligt {

    /**
     * @param jsonObj
     * @returns {CommonBeteiligt}
     */
    static create(jsonObj) {
        return this._create(jsonObj);
    }

    /**
     * @param jsonObj
     * @returns {OtherBeteiligt}
     * @private
     */
    static _create(jsonObj) {
        if (jsonObj) {
            return new OtherBeteiligt(
                JsonSerialization.getProperty(jsonObj, 'id'),
                JsonSerialization.getProperty(jsonObj, 'name'),
                JsonSerialization.getProperty(jsonObj, 'social'),
                JsonSerialization.getProperty(jsonObj, 'address'),
                JsonSerialization.getProperty(jsonObj, 'notes'),
                JsonSerialization.getProperty(jsonObj, 'duedate'),
                JsonSerialization.getProperty(jsonObj, 'fee'),
                JsonSerialization.getProperty(jsonObj, 'charges'),
                JsonSerialization.getProperty(jsonObj, 'project'),
                JsonSerialization.getProperty(jsonObj, 'capOnDepenses')
            )
        } else {
            return new OtherBeteiligt();
        }
    }

    constructor(id, name, social, address, notes, duedate, fee, charges, project, capOnDepenses) {
        super(id, name, social, address, notes);
        this._duedate = duedate;
        this._fee = fee;
        this._charges = charges;
        this._project = project;
        this._capOnDepenses = capOnDepenses;
        this.type = "other";
    }

    get duedate() {
        return this._duedate;
    }

    set duedate(value) {
        this._duedate = value;
    }

    get fee() {
        return this._fee;
    }

    set fee(value) {
        this._fee = value;
    }

    get charges() {
        return this._charges;
    }

    set charges(value) {
        this._charges = value;
    }

    get project() {
        return this._project;
    }

    set project(value) {
        this._project = value;
    }

    get capOnDepenses() {
        return this._capOnDepenses;
    }

    set capOnDepenses(value) {
        this._capOnDepenses = value;
    }

    isEmpty() {
        return super.isEmpty() && !this.duedate && !this.fee && !this.charges;
    }
}

class AdBeteiligt extends CommonBeteiligt {

    /**
     * @param jsonObj
     * @returns {CommonBeteiligt}
     */
    static create(jsonObj) {
        return this._create(jsonObj);
    }

    /**
     *
     * @param jsonObj
     * @returns {AdBeteiligt}
     * @private
     */
    static _create(jsonObj) {
        if (jsonObj) {
            return new AdBeteiligt(
                JsonSerialization.getProperty(jsonObj, 'id'),
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

    constructor(id, name, social, address, notes, format, placement, price) {
        super(id, name, social, address, notes);
        this._format = format;
        this._placement = placement;
        this._price = price;
        this._total = 0;
        this.type = "ad";
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

// exports.ModuleConfig = ModuleConfig;
// exports.CommonBeteiligt = CommonBeteiligt;
// exports.OtherBeteiligt = OtherBeteiligt;
// exports.AdBeteiligt = AdBeteiligt;