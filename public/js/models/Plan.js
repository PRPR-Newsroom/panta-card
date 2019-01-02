/**
 * The Plan class.
 */
class Plan {

    static get VERSION() {
        return 1;
    }

    /**
     * Create a new Plan entity out of this json object
     * @param json
     * @returns {Plan}
     */
    static create(json) {
        return this._create(json);
    }

    /**
     * Create a new Plan entity using this json object
     * @param json
     * @returns {Plan}
     * @private
     */
    static _create(json) {
        if (json) {
            let plan = new Plan(
                JsonSerialization.getProperty(json, 'id'),
                JsonSerialization.getProperty(json, 'measures'),
                JsonSerialization.getProperty(json, 'description'),
                JsonSerialization.getProperty(json, 'fee'),
                JsonSerialization.getProperty(json, 'projectFee'),
                JsonSerialization.getProperty(json, 'thirdPartyCharges'),
                JsonSerialization.getProperty(json, 'thirdPartyTotalCosts'),
                0.0 /* this property is not persisted in here so should not be managed here */,
                JsonSerialization.getProperty(json, 'totalCosts'),
                JsonSerialization.getProperty(json, 'visual'),
                JsonSerialization.getProperty(json, 'form'),
                JsonSerialization.getProperty(json, 'online'),
                JsonSerialization.getProperty(json, 'season'),
                JsonSerialization.getProperty(json, 'region'),
                JsonSerialization.getProperty(json, 'place')
            );

            // set the version
            plan.version = JsonSerialization.getProperty(json, 'version');
            return plan;
        } else {
            return new Plan();
        }
    }

    /**
     *
     * @param id string
     * @param measures Textfeld – Stichwort zum Inhalt immer fix hinterlegt
     * @param description Fixe Zahl, entspricht der Seitenzahl = Start des Arikels in einem Projekt. Ist zentral für das SORTIEREN innerhalb der Liste
     * @param fee
     * @param projectFee
     * @param thirdPartyCharges
     * @param thirdPartyTotalCosts
     * @param capOnDepenses
     * @param totalCosts
     * @param visual
     * @param form
     * @param online
     * @param season
     * @param region
     * @param place
     */
    constructor(id, measures, description, fee, projectFee, thirdPartyCharges, thirdPartyTotalCosts, capOnDepenses, totalCosts,
                visual, form, online, season, region, place) {
        this._id = id || uuid();
        this._fee = fee;
        this._projectFee = projectFee;
        this._thirdPartyCharges = thirdPartyCharges;
        this._thirdPartyTotalCosts = thirdPartyTotalCosts;
        this._capOnDepenses = capOnDepenses;
        this._totalCosts = totalCosts;
        this._visual = visual;
        this._form = form;
        this._online = online;
        this._season = season;
        this._region = region;
        this._place = place;
        this._measures = measures;
        this._description = description;
        this._version = Plan.VERSION;
    }

    /**
     * Check if this is "empty" or not. The article is considered empty if no simple property (without involvements) is set
     * @returns {*}
     */
    isEmpty() {
        return isBlank(this._fee) && isBlank(this._charges) && isBlank(this._thirdPartyCharges) && isBlank(this._capOnDepenses)
            && isBlank(this._visual) && isBlank(this._form) && isBlank(this._online) && isBlank(this._season) && isBlank(this._region)
            && isBlank(this._place) && isBlank(this._measures) && isBlank(this._description);
    }


    // GETTER & SETTER

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get measures() {
        return this._measures;
    }

    set measures(value) {
        this._measures = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    /**
     * The total of all current fees (Honorare der Beteiligten)
     */
    get fee() {
        return this._fee;
    }

    set fee(value) {
        this._fee = value;
    }

    /**
     * The overall total of all fees (Total aller Honorare im gesamten Projekt)
     */
    get projectFee() {
        return this._projectFee;
    }

    set projectFee(value) {
        this._projectFee = value;
    }

    /**
     * The total of all current charges (Total der Spesen der Beteiligten)
     * @returns {*}
     */
    get thirdPartyCharges() {
        return this._thirdPartyCharges;
    }

    set thirdPartyCharges(value) {
        this._thirdPartyCharges = value;
    }

    /**
     * The overall total of all charges in this projct/BOARD
     * @returns {*}
     */
    get thirdPartyTotalCosts() {
        return this._thirdPartyTotalCosts;
    }

    set thirdPartyTotalCosts(value) {
        this._thirdPartyTotalCosts = value;
    }

    /**
     * Get Kostendach
     * @returns {*}
     */
    get capOnDepenses() {
        return this._capOnDepenses;
    }

    /**
     * Set Kostendach
     * @param value
     */
    set capOnDepenses(value) {
        this._capOnDepenses = value;
    }

    get totalCosts() {
        return this._totalCosts;
    }

    set totalCosts(value) {
        this._totalCosts = value;
    }

    get visual() {
        return this._visual;
    }

    set visual(value) {
        this._visual = value;
    }

    get form() {
        return this._form;
    }

    set form(value) {
        this._form = value;
    }

    get online() {
        return this._online;
    }

    set online(value) {
        this._online = value;
    }

    get season() {
        return this._season;
    }

    set season(value) {
        this._season = value;
    }

    get region() {
        return this._region;
    }

    set region(value) {
        this._region = value;
    }

    get place() {
        return this._place;
    }

    set place(value) {
        this._place = value;
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }
}